import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RegistrationApiService } from '../shared/services/registration-api.service';
import { EmailVerificationResponse } from '../shared/services/registration-api.model';

@Injectable()
export class EmailVerificationResolver implements Resolve<Observable<EmailVerificationResponse>> {
  constructor(private registrationApiService: RegistrationApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = route.queryParamMap.get('token');
    return this.registrationApiService.confirmRegistration(token);
  }
}