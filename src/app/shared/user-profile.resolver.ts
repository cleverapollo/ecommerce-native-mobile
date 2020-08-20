import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from './models/user.model';
import { UserApiService } from './api/user-api.service';
import { UserProfileDataService } from '../settings/user-profile-data.service';

@Injectable()
export class UserProfileResolver implements Resolve<Observable<UserProfile>> {
  constructor(private userProfileDataService: UserProfileDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userProfileDataService.getUserProfile();
  }
}