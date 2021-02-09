import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { UserState } from '@core/models/user.model';
import { WanticJwtToken } from '@core/models/login.model';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private storageService: StorageService,  
    private jwtHelper: JwtHelperService,
    private logger: LogService
  ) {}

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

}

export interface UserSettings {
  credentialsSaved?: boolean
}