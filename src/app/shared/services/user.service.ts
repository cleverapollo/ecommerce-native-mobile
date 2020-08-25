import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WanticJwtToken, UserState } from '../api/user-api.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storage: Storage,  private jwtHelper: JwtHelperService) { }

  get email() : Promise<string> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth-token').then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.sub);
      }, reject);
    });
  }

  get userState() : Promise<UserState> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth-token').then( rawToken => {
        const decodedToken: WanticJwtToken = this.jwtHelper.decodeToken(rawToken);
        resolve(decodedToken.userState);
      }, reject);
    });
  }

}
