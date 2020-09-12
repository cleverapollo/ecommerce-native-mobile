import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailVerificationResponse } from '../models/email-verification.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  constructor(private apiService: ApiService) { }

  confirmRegistration(emailVerficationToken: string) : Observable<EmailVerificationResponse> {
    const params = new HttpParams().set('token', emailVerficationToken);
    return this.apiService.get(`registration/confirmation`, params);
  }

  requestEmailVerificationLink() {
    return this.apiService.get(`registration/request-email-verification-link`).toPromise();
  }

}
