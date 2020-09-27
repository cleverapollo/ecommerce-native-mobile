import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { UserService, UserSettings } from './user.service';
import { AuthService } from '../api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(null);
  get isAuthenticated() : boolean | Promise<boolean> {
    let state = this.authenticationState.value;
    if (state === null) {
      return this.validTokenExists();
    }
    return state;
  }

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private jwtHelper: JwtHelperService,
    private userService: UserService,
    private authService: AuthService
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
            this.reloginIfPossible();
          }
        }
      })
    })
  }

  login(email: string, password: string, saveCredentials: boolean) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.login(email, password).subscribe(response => {
        if (saveCredentials) {
          this.saveCredentialsAndUserSettings(email, password);
        }
        this.saveToken(response.token)
          .then(resolve)
          .catch(reject);
      });
    })
  }

  async logout() {
    await this.storageService.remove(StorageKeys.AUTH_TOKEN, true);
    await this.storageService.remove(StorageKeys.LOGIN_PASSWORD, true);
    this.authenticationState.next(false);
  }

  private reloginIfPossible() {
    this.userService.userSettings.then(settings => {
      if (settings && settings.credentialsSaved) {
        this.storageService.get<string>(StorageKeys.LOGIN_EMAIL).then( email => {
          this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD).then(password => {
            this.authService.login(email, password).subscribe(response => {
              this.saveToken(response.token)
            })
          }, this.removeAuthTokenOnError);
        }, this.removeAuthTokenOnError);
      } else {
        this.storageService.remove(StorageKeys.AUTH_TOKEN);
      }
    });
  }

  private removeAuthTokenOnError(reason: any) {
    console.error(reason);
    this.storageService.remove(StorageKeys.AUTH_TOKEN);
  }

  saveToken(token: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageService.set(StorageKeys.AUTH_TOKEN, token, true).then(() => {
        console.log('token: ', this.jwtHelper.decodeToken(token));
        this.authenticationState.next(true);
        resolve();
      }).catch( e => {
        this.authenticationState.next(false);
        reject();
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
    return new Promise((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then((token) => {
        if (token) {
          const isExpired = this.jwtHelper.isTokenExpired(token);
          resolve(!isExpired);
        } else {
          reject();
        }
      })
    });
  }

}