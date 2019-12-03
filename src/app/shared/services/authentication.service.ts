import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private apiService: ApiService) {}

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

  logout() {
    this.storage.remove('auth-token').then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}
