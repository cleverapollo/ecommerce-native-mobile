import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { UserState } from '@core/models/user.model';
import { WanticJwtToken } from '@core/models/login.model';
import { LogService } from './log.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _accountIsEnabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $accountIsEnabled: Observable<boolean> = this._accountIsEnabled.asObservable();

  constructor(
    private storageService: StorageService,  
    private jwtHelper: JwtHelperService,
    private logger: LogService
  ) {
    this.init();
  }

  init() {
    this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then(rawToken => {
      if (rawToken) {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        if (decodedToken) {
          this._accountIsEnabled.next(decodedToken.userState === UserState.ACTIVE);
        }
      }
    });
  }

  set accountIsEnabled(isEnabled: boolean) {
    this._accountIsEnabled.next(isEnabled);
  }

  get email() : Promise<string> {
    this.logger.log('UserService email');
    return new Promise((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.sub);
      }, reject);
    });
  }

  get userState() : Promise<UserState> {
    this.logger.log('UserService userState');
    return new Promise((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.userState);
      }, reject);
    });
  }

  get userSettings(): Promise<UserSettings> {
    return new Promise((resolve) => {
      this.storageService.get<UserSettings>(StorageKeys.USER_SETTINGS).then( settings => {
        resolve(settings);
      }, () => {
        resolve({});
      });
    });
  }

  get showOnboardingSlides(): Promise<Boolean> {
    return new Promise((resolve) => {
      this.storageService.get<boolean>(StorageKeys.SHOW_ONBOARDING_SLIDES).then(show => {
        if (show === null) {
          resolve(true);
        } else {
          resolve(show);
        }
      }, () => {
        resolve(false);
      });
    })
  }

  updateShowOnboardingSlidesState(): Promise<void> {
    return this.storageService.set(StorageKeys.SHOW_ONBOARDING_SLIDES, false)
  }

}

export interface UserSettings {
  credentialsSaved?: boolean
}