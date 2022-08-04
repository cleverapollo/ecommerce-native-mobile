import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { SignupRequestSocialLogin, SignupRequest, SignInRequest, SignInResponse,
         SignInRequestEmailPassword, ConfirmPasswordResetRequest, ConfirmPasswordResetResponse } from '@core/models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static REST_END_POINT = 'auth';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  signupSocialLogin(signInRequest: SignupRequestSocialLogin): Observable<void> {
    return this.apiService.post<void>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/signup-social-login`, signInRequest).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  signup(signupRequest: SignupRequest): Observable<void> {
    return this.apiService.post<void>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/signup`, signupRequest).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  signInWithThirdPartyAuthProvider(signupRequest: SignInRequest): Observable<SignInResponse> {
    return this.apiService.post<SignInResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/signin-third-party`, signupRequest);
  }

  signInWithEmailAndPassword(signInRequest: SignInRequestEmailPassword): Observable<SignInResponse> {
    return this.apiService.post<SignInResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/signin-email-password`, signInRequest);
  }

  resetPassword(email: string): Observable<void> {
    return this.apiService.post<void>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/reset-password`, {
      email
    });
  }

  confirmPasswordReset(requestBody: ConfirmPasswordResetRequest): Observable<ConfirmPasswordResetResponse> {
    const uri = `${ApiVersion.v1}/${AuthService.REST_END_POINT}/confirm-password-reset`;
    return this.apiService.patch<ConfirmPasswordResetResponse>(uri, requestBody);
  }

  private errorMessageForRegistrationServerError(error: HttpErrorResponse) {
    let errorMessage: string
    switch (error.status) {
      case 409:
        errorMessage = 'Ein Benutzer mit der eingegebenen E-Mail-Adresse existiert bereits!';
        break;
    }
    return errorMessage;
  }
}
