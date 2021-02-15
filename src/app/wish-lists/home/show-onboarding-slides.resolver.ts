import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '@core/services/user.service';

@Injectable()
export class ShowOnboardingSlidesResolver implements Resolve<Promise<Boolean>> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.showOnboardingSlides;
  }
}