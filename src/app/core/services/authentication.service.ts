import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { UserService } from './user.service';
import { AuthService } from '../api/auth.service';
import { CacheService } from 'ionic-cache';
import { HTTP } from '@ionic-native/http/ngx';
import { WanticJwtToken } from '@core/models/login.model';
import { LogService } from './log.service';
import { EmailVerificationService } from './email-verification.service';
import { LoadingService } from './loading.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string;
  isAuthenticated = new BehaviorSubject<boolean>(null);

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private jwtHelper: JwtHelperService,
    private userService: UserService,
    private authService: AuthService,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private logger: LogService,
    private emailVerificationService: EmailVerificationService,
    private loadingService: LoadingService
  ) { 
    this.initToken();
  }

  async initToken() {
    await this.loadToken();
    if (this.token && this.jwtHelper.isTokenExpired(this.token)) {
      await this.refreshExpiredToken();
    }
  }

  login(email: string, password: string, saveCredentials: boolean) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingService.showLoadingSpinner();
      this.authService.login(email, password).pipe(first()).subscribe({
        next: response => {
          if (saveCredentials) {
            this.saveCredentials(email, password);
          }
          this.updateToken(response.token).then(() => {
            this.handleLoginSucessResponse();
            resolve();
          }, error => {
            this.logger.error(error);
            reject();
          }).finally(() => {
            this.loadingService.dismissLoadingSpinner();
          });
        },
        error: errorResponse => {
          this.logger.error(errorResponse);
          this.handleLoginErrorResponse();
          this.loadingService.dismissLoadingSpinner();
          reject();
        }
      })
    })
  }

  async logout() {
    await this.storageService.clear();
    await this.cache.clearAll();
    if (this.platform.is('capacitor')) {
      this.nativeHttpClient.setHeader('*', 'Authorization', undefined);
    }
    this.isAuthenticated.next(false);
  }

   async refreshExpiredToken() {
    const credentials = await this.loadCredentials();
    if (credentials) {
      this.refreshToken(credentials);
    } else {
      this.isAuthenticated.next(false);
      this.token = null;
    }
  }

  private refreshToken(credentials: { email: string, password: string }) {
    this.loadingService.showLoadingSpinner();
    this.authService.login(credentials.email, credentials.password).pipe(first()).subscribe({
      next: response => {
        this.updateToken(response.token).then(() => {
          this.handleLoginSucessResponse();
        }, this.logger.error).finally(() => {
          this.loadingService.dismissLoadingSpinner();
        });
      }, 
      error: errorRespone => {
        this.logger.error(errorRespone);
        this.removeToken().then(() => {
          this.handleLoginErrorResponse();
        }, this.logger.error).finally(() => {
          this.loadingService.dismissLoadingSpinner();
        });
      }
    })
  }

  private handleLoginErrorResponse() {
    this.isAuthenticated.next(false);
  }

  private handleLoginSucessResponse() {
    this.isAuthenticated.next(true);
  }

  private async loadCredentials() {
    const email = await this.storageService.get<string>(StorageKeys.LOGIN_EMAIL, true);
    const password = await this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD, true);
    if (email && password) {
      return { email: email, password: password }
    } else {
      return null;
    }
  }

  private async loadToken() {
    const token = await this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  updateToken(token: string) {
    this.token = token;
    this.updateUserProperties(token);
    this.updateAuthorizationHeaderForNativeHttpClient(token);
    return this.storageService.set(StorageKeys.AUTH_TOKEN, token, true);
  }

  private removeToken() {
    return this.storageService.remove(StorageKeys.AUTH_TOKEN);
  }

  private updateUserProperties(encodedToken: string) {
    const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(encodedToken);
    this.emailVerificationService.updateEmailVerificationStatus(decodedToken.emailVerificationStatus);
    this.userService.accountIsEnabled = decodedToken.accountEnabled;
  }

  private updateAuthorizationHeaderForNativeHttpClient(token: string) {
    if (this.platform.is('capacitor')) {
      this.nativeHttpClient.setHeader('*', 'Authorization', `Bearer ${token}`);
    }
  }

  private saveCredentials(email: string, password: string) {
    this.storageService.set(StorageKeys.LOGIN_EMAIL, email, true).then(() => {
      this.storageService.set(StorageKeys.LOGIN_PASSWORD, password, true).then(() => {
        this.logger.debug('email and password saved sucessfully');
      }, this.logger.error)
    }, this.logger.error);
  }

}
