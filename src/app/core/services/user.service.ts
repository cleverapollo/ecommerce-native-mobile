import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WanticJwtToken } from '@core/models/login.model';
import { UserState } from '@core/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogService } from './log.service';
import { StorageKeys, StorageService } from './storage.service';

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
          this._accountIsEnabled.next(decodedToken.accountEnabled);
        }
      }
    });
  }

  get accountIsEnabled(): boolean {
    return this._accountIsEnabled.getValue();
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

  async showOnboardingSlides(): Promise<boolean> {
    let show: Boolean = await this.storageService.get<boolean>(StorageKeys.SHOW_ONBOARDING_SLIDES);
    if (show === null) {
      const decodedJwToken = await this.getDecodesToken();
      if (decodedJwToken) {
        show = decodedJwToken.showOnboardingSlidesIos;
        await this.storageService.set(StorageKeys.SHOW_ONBOARDING_SLIDES, show);
      } else {
        show = true;
      }
    } 
    return Boolean(show);
  }

  private async getDecodesToken(): Promise<WanticJwtToken> {
    const rawToken = await this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true);
    return this.jwtHelper.decodeToken(rawToken);
  }

}

export interface UserSettings {
  credentialsSaved?: boolean
}