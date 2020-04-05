import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RegistrationDto, RegistrationPartnerDto } from '../registration-form';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private apiService: ApiService) { }

  register(dto: RegistrationDto) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/register', dto).subscribe( response => {
        console.log(response);
        resolve();
      }, e => {
        console.error(e);
        reject();
      });
    })
  }

  registerPartner(dto: RegistrationPartnerDto) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/register-partner', dto).subscribe( response => {
        console.log(response);
        resolve();
      }, e => {
        console.error(e);
        reject();
      });
    })
  }
}
