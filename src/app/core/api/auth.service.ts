import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { RegistrationDto, RegistrationPartnerDto } from 'src/app/registration/registration-form';
import { LoginResponse } from '@core/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static REST_END_POINT = 'auth'

  constructor(private apiService: ApiService) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post(`${AuthService.REST_END_POINT}/login`, {
      username: email,
      password: password
    }) as Observable<LoginResponse>;
  }

  register(dto: RegistrationDto) : Observable<LoginResponse> {
    return this.apiService.post(`${AuthService.REST_END_POINT}/register`, dto) as Observable<LoginResponse>;
  }

  registerPartner(dto: RegistrationPartnerDto) : Observable<any> {
    return  this.apiService.post(`${AuthService.REST_END_POINT}/register-partner`, dto);
  }
}
