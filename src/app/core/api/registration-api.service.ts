import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailVerificationResponse } from '@core/models/email-verification.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private static REST_END_POINT = 'registration';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  confirmRegistration(emailVerficationToken: string) : Observable<EmailVerificationResponse> {
    const params = new HttpParams().set('token', emailVerficationToken);
    return this.apiService.get<EmailVerificationResponse>(`${RegistrationApiService.REST_END_POINT}/confirmation`, params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  requestEmailVerificationLink() {
    return this.apiService.get(`${RegistrationApiService.REST_END_POINT}/request-email-verification-link`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
