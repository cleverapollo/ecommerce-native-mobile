import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError, tap } from 'rxjs/operators';
import { LoginResponse } from '@core/models/login.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  private static URI = 'registration';

  constructor(private apiService: ApiService, 
    private errorHandler: ApiErrorHandlerService,
    private authService: AuthenticationService) { }

  confirmRegistration(emailVerficationToken: string): Observable<LoginResponse> {
    const params = new HttpParams().set('token', emailVerficationToken);
    const uri = this.createUri('confirmation');
    return this.apiService.get<LoginResponse>(uri, params).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  requestEmailVerificationLink(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uri = this.createUri('request-email-verification-link');
      this.apiService.get<LoginResponse>(uri).subscribe({
        next: response => {
          this.authService.saveToken(response.token);
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
    return `${RegistrationApiService.URI}/${subUri}`
  }

}
