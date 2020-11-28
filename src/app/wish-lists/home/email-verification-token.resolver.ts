import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrationApiService } from '@core/api/registration-api.service';
import { LoginResponse } from '@core/models/login.model';

@Injectable()
export class EmailVerificationTokenResolver implements Resolve<Observable<LoginResponse>> {
  constructor(private registrationApiService: RegistrationApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = route.queryParamMap.get('emailVerificationToken');
    if (token !== null) {
        return this.registrationApiService.confirmRegistration(token);
    }
  }
}