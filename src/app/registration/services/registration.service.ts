import { Injectable } from '@angular/core';
import { RegistrationForm } from '../registration-form';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private apiService: ApiService) { }

  register(form: RegistrationForm) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post('auth/register', form).subscribe( response => {
        console.log(response);
        resolve();
      }, e => {
        console.error(e);
        reject();
      });
    })

  }
}
