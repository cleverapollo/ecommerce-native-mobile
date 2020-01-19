import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage';
import { LoginResponse } from './login-response';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private platform: Platform, private apiService: ApiService) {
    this.platform.ready().then(() => {
      this.storage.get('auth-token').then((token) => {
        if (token) {
          this.authenticationState.next(true);
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
        this.storage.set('auth-token', response.token).then(() => {
          this.authenticationState.next(true);
          resolve();
        }).catch( e => {
          this.authenticationState.next(false);
          reject();
        });
      });
    })

  }

  async logout() {
    await this.storage.remove('auth-token');
    this.authenticationState.next(false);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}
