import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { RegistrationDto, RegistrationPartnerDto } from 'src/app/registration/registration-form';
import { LoginResponse } from '@core/models/login.model';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static REST_END_POINT = 'auth'

  constructor(private apiService: ApiService, private toastService: ToastService) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`${AuthService.REST_END_POINT}/login`, {
      username: email,
      password: password
    }).pipe(
      catchError( error => this.handleLoginError(error))
    );
  }

  private handleLoginError(error: any) {
    let errorMessage = this.errorMessageForLoginResponse(error);
    this.toastService.presentErrorToast(errorMessage);
    return throwError(error);
  }

  private errorMessageForLoginResponse(error: any) {
    let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.log(`Error: ${error.error.message}`);
      } else {
        console.log(`error status : ${error.status} ${error.statusText}`);
        errorMessage = this.errorMessageForLoginServerError(error, errorMessage);
      }
    }
    return errorMessage;
  }

  private errorMessageForLoginServerError(error: HttpErrorResponse, errorMessage: string) {
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

  register(dto: RegistrationDto) : Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`${AuthService.REST_END_POINT}/register`, dto).pipe(
      catchError(error => this.handleRegistrationError(error))
    );
  }

  registerPartner(dto: RegistrationPartnerDto) : Observable<any> {
    return  this.apiService.post(`${AuthService.REST_END_POINT}/register-partner`, dto).pipe(
      catchError(error => this.handleRegistrationError(error))
    );
  }

  private handleRegistrationError(error: any) {
    let errorMessage = this.errorMessageForRegistrationResponse(error);
    this.toastService.presentErrorToast(errorMessage);
    return throwError(error);
  }

  private errorMessageForRegistrationResponse(error: any) {
    let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.log(`Error: ${error.error.message}`);
      } else {
        console.log(`error status : ${error.status} ${error.statusText}`);
        errorMessage = this.errorMessageForRegistrationServerError(error, errorMessage);
      }
    }
    return errorMessage;
  }

  private errorMessageForRegistrationServerError(error: HttpErrorResponse, errorMessage: string) {
    switch (error.status) {
      case 409:
        errorMessage = 'Ein Benutzer mit der eingegeben E-Mail-Adresse existiert bereits!';
        break;
    }
    return errorMessage;
  }
}
