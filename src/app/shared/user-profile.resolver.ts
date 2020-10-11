import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from '@core/models/user.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Injectable()
export class UserProfileResolver implements Resolve<Observable<UserProfile>> {
  constructor(private userProfileStore: UserProfileStore) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userProfileStore.loadUserProfile();
  }
}