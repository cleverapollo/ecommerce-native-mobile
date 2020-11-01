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
    private router: Router
  ) { 
    this.init();
  }

  private init() {
    this.platform.ready().then(() => {
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
        console.info('login successful', response)
        if (saveCredentials) {
          this.saveCredentialsAndUserSettings(email, password);
        }
        this.saveToken(response.token)
          .then(resolve)
          .catch(reject);
      }, reject);
    })
  }

  async logout() {
    await this.storageService.remove(StorageKeys.AUTH_TOKEN, true);
    await this.storageService.remove(StorageKeys.LOGIN_PASSWORD, true);
    await this.cache.clearAll();
    this.authenticationState.next(false);
  }

  private async reloginIfPossible(): Promise<void> {
    try {
      const userSettings = await this.userService.userSettings;
      if (userSettings && userSettings.credentialsSaved) {
        const email = await this.storageService.get<string>(StorageKeys.LOGIN_EMAIL, true);
        const password = await this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD, true);
        const loginResponse = await this.authService.login(email, password).toPromise();
        return this.saveToken(loginResponse.token);
      } else {
        this.storageService.remove(StorageKeys.AUTH_TOKEN);
        return Promise.reject();
      }
    } catch (error) {
      console.error(error);
      this.storageService.remove(StorageKeys.AUTH_TOKEN);
      return Promise.reject();
    }
  }

  saveToken(token: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.nativeHttpClient.setHeader('*', 'Authorization', `Bearer ${token}`);
      }
      this.storageService.set(StorageKeys.AUTH_TOKEN, token, true).then(() => {
        console.log('token: ', this.jwtHelper.decodeToken(token));
        this.authenticationState.next(true);
        resolve();
      }).catch( e => {
        console.error('could not save token ', e)
        this.authenticationState.next(false);
        reject(e);
      });
    })
  }

  private saveCredentialsAndUserSettings(email: string, password: string) {
    this.storageService.set(StorageKeys.LOGIN_EMAIL, email, true).catch(console.error);
    this.storageService.set(StorageKeys.LOGIN_PASSWORD, password, true).catch(console.error);
    this.userService.userSettings.then( settings => {
      const settingsToSave: UserSettings = settings ? settings : {};
      settingsToSave.credentialsSaved = true;
      this.storageService.set(StorageKeys.USER_SETTINGS, settings);
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
        console.info('no auth token found');
        resolve(false);
      })
    });
  }

}
