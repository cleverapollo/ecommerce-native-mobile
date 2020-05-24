import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage';
import { LoginResponse } from './login-response';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(null);

  constructor(private storage: Storage, private platform: Platform, private apiService: ApiService, private jwtHelper: JwtHelperService) {
    this.platform.ready().then(() => {
      this.storage.get('auth-token').then((token) => {
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          this.authenticationState.next(true);
        }
        if (this.jwtHelper.isTokenExpired(token)) {
          this.storage.remove('auth-token');
        }
      })
    })
  }

  login(email: string, password: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/login', {
        username: email,
        password: password
      }).subscribe((response: LoginResponse) => {
        this.saveToken(response.token).then(() => {
          resolve();
        }).catch( e => {
          reject();
        });
      });
    })

  }

  async logout() {
    await this.storage.remove('auth-token');
    this.authenticationState.next(false);
  }

  isAuthenticated() : boolean | Promise<boolean> {
    let state = this.authenticationState.value;
    if (state === null) {
      return this.validTokenExists();
    }
    return state;
  }

  saveToken(token: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set('auth-token', token).then(() => {
        console.log('token: ', this.jwtHelper.decodeToken(token));
        this.authenticationState.next(true);
        resolve();
      }).catch( e => {
        this.authenticationState.next(false);
        reject();
      });
    })
  }

  validTokenExists() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth-token').then((token) => {
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
