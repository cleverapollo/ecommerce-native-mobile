import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from '@core/models/user.model';
import { UserProfileDataService } from '@menu/settings/user-profile-data.service';

@Injectable()
export class UserProfileResolver implements Resolve<Observable<UserProfile>> {
  constructor(private userProfileDataService: UserProfileDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userProfileDataService.loadUserProfile();
  }
}