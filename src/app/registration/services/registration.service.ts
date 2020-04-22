import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RegistrationDto, RegistrationPartnerDto } from '../registration-form';
import { LoginResponse } from 'src/app/shared/services/login-response';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private apiService: ApiService) { }

  register(dto: RegistrationDto) : Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/register', dto).subscribe( response => {
        resolve(response as LoginResponse);
      }, e => {
        reject(e);
      });
    })
  }

  registerPartner(dto: RegistrationPartnerDto) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/register-partner', dto).subscribe( response => {
        resolve();
      }, e => {
        reject(e);
      });
    })
  }
}
