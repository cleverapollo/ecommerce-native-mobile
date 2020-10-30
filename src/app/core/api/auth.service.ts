import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { RegistrationDto, RegistrationPartnerDto } from 'src/app/registration/registration-form';
import { LoginResponse } from '@core/models/login.model';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@core/services/toast.service';
import { ApiErrorHandlerService } from './api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static REST_END_POINT = 'auth'

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  login(email: string, password: string): Observable<LoginResponse> {
    let requestData = {
      username: email,
      password: password
    };
    return this.apiService.post<LoginResponse>(`${AuthService.REST_END_POINT}/login`, requestData).pipe(
      catchError( error => this.errorHandler.handleError(error, this.errorMessageForLoginServerError))
    );
  }
  
  register(dto: RegistrationDto) : Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`${AuthService.REST_END_POINT}/register`, dto).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  registerPartner(dto: RegistrationPartnerDto) : Observable<any> {
    return  this.apiService.post(`${AuthService.REST_END_POINT}/register-partner`, dto).pipe(
      catchError(error => this.errorHandler.handleError(error, this.errorMessageForRegistrationServerError))
    );
  }

  private errorMessageForLoginServerError(error: HttpErrorResponse): string {
    let errorMessage: string
    switch (error.status) {
      case 401:
        errorMessage = 'Dein Passwort stimmt nicht mit deiner E-Mail-Adresse überein.';
        break;
      case 403:
        errorMessage = 'Dein Account ist leider noch nicht freigeschaltet.';
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
        errorMessage = 'Ein Benutzer mit der eingegeben E-Mail-Adresse existiert bereits!';
        break;
    }
    return errorMessage;
  }
}
