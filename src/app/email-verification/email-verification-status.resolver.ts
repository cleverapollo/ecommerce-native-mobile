import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PublicEmailVerificationStatus } from '@core/models/user.model';
import { UserApiService } from '@core/api/user-api.service';

@Injectable()
export class EmailVerificationStatusResolver implements Resolve<Promise<PublicEmailVerificationStatus>> {
  constructor(private userApiService: UserApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = route.queryParamMap.get('emailVerificationToken');
    if (token !== null) {
      return this.userApiService.verifyEmail(token);
    } else {
      return Promise.resolve(PublicEmailVerificationStatus.ERROR);
    }
  }
}