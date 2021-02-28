import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { UserService, UserSettings } from './user.service';
import { AuthService } from '../api/auth.service';
import { CacheService } from 'ionic-cache';
import { HTTP } from '@ionic-native/http/ngx';
import { resolve } from 'url';
import { Router } from '@angular/router';
import { WanticJwtToken } from '@core/models/login.model';
import { LogService } from './log.service';
import { EmailVerificationService } from './email-verification.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(null);
  get isAuthenticated() : Observable<boolean> {
    let state = this.authenticationState.value;
    if (state === null) {
      return from(this.validTokenExists());
    }
    return of(state);
  }

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private jwtHelper: JwtHelperService,
    private userService: UserService,
    private authService: AuthService,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private router: Router,
    private logger: LogService,
    private emailVerificationService: EmailVerificationService,
    private loadingService: LoadingService
  ) { 
    this.init();
  }

  private init() {
    this.platform.ready().then(() => {
      this.logger.debug('AuthenticationService init');
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then((token) => {
        if (token) {
          if (!this.jwtHelper.isTokenExpired(token)) {
            this.authenticationState.next(true);
          } else {
            this.reloginIfPossible().then(() => {
              this.authenticationState.next(true);
              this.router.navigateByUrl('/secure/home');
            });
          }
        }
      })
    })
  }

  login(email: string, password: string, saveCredentials: boolean) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.login(email, password).subscribe(response => {
        this.logger.info('login successful')
        if (saveCredentials) {
          this.saveCredentialsAndUserSettings(email, password);
        }
        this.saveToken(response.token).then(resolve).catch(reject);
      }, reject);
    })
  }

  async logout() {
    await this.storageService.clear();
    await this.cache.clearAll();
    this.authenticationState.next(false);
  }

  async reloginIfPossible(): Promise<void> {
    try {
      const userSettings = await this.userService.userSettings;
      if (userSettings?.credentialsSaved) {
        const email = await this.storageService.get<string>(StorageKeys.LOGIN_EMAIL, true);
        const password = await this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD, true);
        const loginResponse = await this.authService.login(email, password).toPromise();
        return this.saveToken(loginResponse.token);
      } else {
        this.storageService.remove(StorageKeys.AUTH_TOKEN);
        return Promise.reject();
      }
    } catch (error) {
      this.logger.error(error);
      this.storageService.remove(StorageKeys.AUTH_TOKEN);
      return Promise.reject();
    }
  }

  async saveToken(token: string) : Promise<void> {
      if (this.platform.is('capacitor')) {
        this.nativeHttpClient.setHeader('*', 'Authorization', `Bearer ${token}`);
      }
      try {
        await this.storageService.set(StorageKeys.AUTH_TOKEN, token, true);
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(token);
        this.logger.debug("decodedToken", decodedToken);
        this.emailVerificationService.updateEmailVerificationStatus(decodedToken.emailVerificationStatus);
        this.userService.accountIsEnabled = decodedToken.accountEnabled;
        this.authenticationState.next(true);
        return Promise.resolve();
      } catch(error) {
        this.logger.error('could not save token ', error)
        this.authenticationState.next(false);
        return Promise.reject(error);
      }
  }

  private saveCredentialsAndUserSettings(email: string, password: string) {
    this.storageService.set(StorageKeys.LOGIN_EMAIL, email, true).catch(this.logger.error);
    this.storageService.set(StorageKeys.LOGIN_PASSWORD, password, true).catch(this.logger.error);
    this.userService.userSettings.then( settings => {
      const settingsToSave: UserSettings = settings ? settings : {};
      settingsToSave.credentialsSaved = true;
      this.storageService.set(StorageKeys.USER_SETTINGS, settingsToSave);
    });
  }

  private validTokenExists() : Promise<boolean> {
    return new Promise((resolve) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then((token) => {
        if (token) {
          const isExpired = this.jwtHelper.isTokenExpired(token);
          resolve(!isExpired);
        } else {
          resolve(false);
        }
      }, e => {
        resolve(false);
      })
    });
  }

}
