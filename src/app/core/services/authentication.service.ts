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

  token = new BehaviorSubject<string>(null);
  isAuthenticated = new BehaviorSubject<boolean>(null);

  async tokenIsExpired(): Promise<boolean> {
    if (this.token.value !== null) {
      return this.jwtHelper.isTokenExpired(this.token.value);
    } else {
      await this.loadToken();
      if (this.token.value !== null) {
        return this.jwtHelper.isTokenExpired(this.token.value);
      } else {
        return null;
      }
    }
  }

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
    if (this.tokenIsExpired) {
      await this.refreshExpiredToken();
    }
  }

  async login(email: string, password: string, saveCredentials: boolean) : Promise<void> {
    const spinner = await this.loadingService.createLoadingSpinner();
    await spinner.present();
    return new Promise((resolve, reject) => {
      this.loadingService.createLoadingSpinner();
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
            this.loadingService.dismissLoadingSpinner(spinner);
          });
        },
        error: errorResponse => {
          this.logger.error(errorResponse);
          this.handleLoginErrorResponse();
          this.loadingService.dismissLoadingSpinner(spinner);
          reject();
        }
      })
    })
  }

  async logout() {
    await this.storageService.clear();
    await this.cache.clearAll();
    this.removeAuthorizationHeaderForNativeHttpClient();
    this.isAuthenticated.next(false);
    return Promise.resolve();
  }

   async refreshExpiredToken(): Promise<void> {
    const credentials = await this.loadCredentials();
    if (credentials) {
      return this.refreshToken(credentials);
    } else {
      this.isAuthenticated.next(false);
      this.token.next(null);
      return Promise.reject();
    }
  }

  private async refreshToken(credentials: { email: string, password: string }): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    return new Promise<void>((resolve, reject) => {
      this.authService.login(credentials.email, credentials.password).pipe(first()).subscribe({
        next: response => {
          this.updateToken(response.token).then(() => {
            this.handleLoginSucessResponse();
            this.loadingService.dismissLoadingSpinner().finally(() => {
              resolve();
            })
          }, error => {
            this.logger.error(error);
            this.loadingService.dismissLoadingSpinner().finally(() => {
              reject();
            })
          });
        }, 
        error: errorRespone => {
          this.logger.error(errorRespone);
          this.removeToken().then(() => {
            this.handleLoginErrorResponse();
          }, this.logger.error).finally(() => {
            this.loadingService.dismissLoadingSpinner().finally(() => {
              reject();
            });
          });
        }
      })
    });
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
    this.token.next(token);
    this.updateAuthState(token);
  }

  private updateAuthState(token: string) {
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isAuthenticated.next(true);
      this.updateAuthorizationHeaderForNativeHttpClient(token);
    } else {
      this.isAuthenticated.next(false);
      this.removeAuthorizationHeaderForNativeHttpClient();
    }
  }

  async updateToken(token: string) {
    await this.storageService.set(StorageKeys.AUTH_TOKEN, token, true);

    this.updateUserProperties(token);
    this.updateAuthState(token);
    this.token.next(token);

    return Promise.resolve();
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

  private removeAuthorizationHeaderForNativeHttpClient() {
    if (this.platform.is('capacitor')) {
      this.nativeHttpClient.setHeader('*', 'Authorization', null);
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
