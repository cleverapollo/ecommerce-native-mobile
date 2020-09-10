import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginResponse } from './login-response';
import { Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(null);

  constructor(
    private storageService: StorageService, 
    private platform: Platform, 
    private apiService: ApiService, 
    private jwtHelper: JwtHelperService
  ) {
    this.platform.ready().then(() => {
      this.storageService.get<string>('auth-token').then((token) => {
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          this.authenticationState.next(true);
        }
        if (this.jwtHelper.isTokenExpired(token)) {
          this.storageService.remove('auth-token');
        }
      })
    })
  }

  login(email: string, password: string, saveCredentials: boolean) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/login', {
        username: email,
        password: password
      }).subscribe((response: LoginResponse) => {
        if (saveCredentials) {
          this.storageService.set('login_email', email).catch(console.error);
          this.storageService.set('login_password', password).catch(console.error);
        }
        this.saveToken(response.token).then(() => {
          resolve();
        }).catch( e => {
          reject();
        });
      });
    })

  }

  async logout() {
    await this.storageService.remove('auth-token');
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
      this.storageService.set('auth-token', token).then(() => {
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
      this.storageService.get<string>('auth-token').then((token) => {
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
