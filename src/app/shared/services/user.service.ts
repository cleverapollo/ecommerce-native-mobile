import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WanticJwtToken, UserState } from '../api/user-api.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService: StorageService,  private jwtHelper: JwtHelperService) { }

  get email() : Promise<string> {
    return new Promise((resolve, reject) => {
      this.storageService.get<string>('auth-token').then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.sub);
      }, reject);
    });
  }

  get userState() : Promise<UserState> {
    return new Promise((resolve, reject) => {
      this.storageService.get<string>('auth-token').then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.userState);
      }, reject);
    });
  }

}
