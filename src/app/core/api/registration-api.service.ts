import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { LoginResponse } from '@core/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private static REST_END_POINT = 'registration';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  confirmRegistration(emailVerficationToken: string) : Observable<LoginResponse> {
    const params = new HttpParams().set('token', emailVerficationToken);
    return this.apiService.get<LoginResponse>(`${RegistrationApiService.REST_END_POINT}/confirmation`, params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  requestEmailVerificationLink() {
    return this.apiService.get(`${RegistrationApiService.REST_END_POINT}/request-email-verification-link`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
