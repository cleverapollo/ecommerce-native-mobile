import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { LoginResponse } from '@core/models/login.model';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { RegistrationRequest, RegistrationResponse } from '@core/models/registration.model';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { ApiVersion } from './api-version';
import { SignupRequest } from '@core/models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static REST_END_POINT = 'auth';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  login(email: string, password: string): Observable<LoginResponse> {
    let requestData = {
      username: email,
      password: password
    };
    return this.apiService.post<LoginResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/login`, requestData).pipe(
      catchError( error => this.errorHandler.handleError(error, this.errorMessageForLoginServerError))
    );
  }

  signup(signupRequest: SignupRequest): Observable<RegistrationResponse> {
    return this.apiService.post<RegistrationResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/signup`, signupRequest).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  register(dto: RegistrationRequest) : Observable<RegistrationResponse> {
    return this.apiService.post<RegistrationResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/register`, dto).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.apiService.get<LoginResponse>(`${ApiVersion.v1}/${AuthService.REST_END_POINT}/refresh-token`)
  }

  private errorMessageForLoginServerError(error: HttpErrorResponse): string {
    let errorMessage: string
    switch (error.status) {
      case HttpStatusCodes.UNAUTHORIZED:
        errorMessage = 'Dein Passwort stimmt nicht mit deiner E-Mail-Adresse überein.';
        break;
      case HttpStatusCodes.FORBIDDEN:
        errorMessage = 'Dein Account ist leider noch nicht freigeschaltet.';
        break;
      case HttpStatusCodes.NOT_FOUND:
        errorMessage = 'Es existiert kein Benutzer mit der angegbenen E-Mail-Adresse.'
        break;
      case 423:
        errorMessage = 'Dein Account ist zurzeit gesperrt und kann nicht verwendet werden.';
        break;
    }
    return errorMessage;
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
