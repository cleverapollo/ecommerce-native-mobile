import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { EmailVerificationStatus, UserState } from '@core/models/user.model';
import { WanticJwtToken } from '@core/models/login.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _emailVerificationStatus = new BehaviorSubject<EmailVerificationStatus>(null);
  emailVerificationStatus = this._emailVerificationStatus.asObservable();

  constructor(private storageService: StorageService,  private jwtHelper: JwtHelperService) { 
    this.initEmailVerificationStatus();
  }

  get email() : Promise<string> {
    console.log('UserService email');
    return new Promise((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.sub);
      }, reject);
    });
  }

  get userState() : Promise<UserState> {
    console.log('UserService userState');
    return new Promise((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true).then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.userState);
      }, reject);
    });
  }

  initEmailVerificationStatus() {
    this.storageService.get<string>(StorageKeys.EMAIL_VERIFICATION_STATUS).then( status => {
      this._emailVerificationStatus.next(EmailVerificationStatus[status]);
    });
  }

  updateEmailVerificationStatus(status: string) {
    this._emailVerificationStatus.next(EmailVerificationStatus[status]);
    return this.storageService.set(StorageKeys.EMAIL_VERIFICATION_STATUS, status)
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