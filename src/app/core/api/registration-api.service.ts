import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError, first, tap } from 'rxjs/operators';
import { LoginResponse } from '@core/models/login.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { resolve } from 'url';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private static URI = 'registrations';

  constructor(private apiService: ApiService, 
    private errorHandler: ApiErrorHandlerService,
    private authService: AuthenticationService) { }

  confirmRegistration(emailVerficationToken: string): Observable<LoginResponse> {
    const params = new HttpParams().set('token', emailVerficationToken);
    const uri = this.createUri('confirm-registration');
    return this.apiService.get<LoginResponse>(uri, params);
  }

  requestEmailVerificationLink(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uri = this.createUri('resend-registration-token');
      this.apiService.get<LoginResponse>(uri).subscribe({
        next: response => {
          this.authService.updateToken(response.token);
          resolve()
        },
        error: reason => {
          this.errorHandler.handleError(reason);
          reject(reason);
        }
      });
    });
  }

  private createUri(subUri: string): string {
    return `${ApiVersion.v1}/${RegistrationApiService.URI}/${subUri}`
  }

}
