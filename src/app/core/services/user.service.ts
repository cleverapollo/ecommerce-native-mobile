import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService, StorageKeys } from './storage.service';
import { EmailVerificationStatus, UserState } from '@core/models/user.model';
import { WanticJwtToken } from '@core/models/login.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService: StorageService,  private jwtHelper: JwtHelperService) { }

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

  get emailVerificationStatus() : Observable<EmailVerificationStatus> {
    return from(new Promise<EmailVerificationStatus>((resolve, reject) => {
      this.storageService.get<string>(StorageKeys.EMAIL_VERIFICATION_STATUS).then( status => {
        resolve(EmailVerificationStatus[status]);
      }, reject);
    }));
  }

  updateEmailVerificationStatus(status: string) {
    return this.storageService.set(StorageKeys.EMAIL_VERIFICATION_STATUS, status)
  }

  get userSettings(): Promise<UserSettings> {
    return new Promise((resolve, reject) => {
      this.storageService.get<UserSettings>(StorageKeys.USER_SETTINGS).then( settings => {
        resolve(settings);
      }, reject);
    });
  }

}

export interface UserSettings {
  credentialsSaved?: boolean
}