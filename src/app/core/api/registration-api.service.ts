import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EmailVerificationResponse, EmailVerificationTokenStatus } from '@core/models/email-verification.model';
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
      catchError(error => {
        let response = {     
          status: EmailVerificationTokenStatus.TECHNICAL_ERROR,
          jwToken: null,
          email: null
        }

        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.log(`Error: ${error.error.message}`);
          } else {
            console.log(`error status : ${error.status} ${error.statusText}`);
            if (error.status == 404) {
              response.status = EmailVerificationTokenStatus.TOKEN_NOT_FOUND;
            } 
          }
        }

        return of(response);
      })
    );
  }

  requestEmailVerificationLink() {
    return this.apiService.get(`${RegistrationApiService.REST_END_POINT}/request-email-verification-link`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
