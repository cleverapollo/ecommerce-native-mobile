import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from '../shared/models/user.model';
import { UserApiService } from '../shared/services/user-api.service';

@Injectable()
export class UserProfileResolver implements Resolve<Observable<UserProfile>> {
  constructor(private userApiService: UserApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userApiService.getProfile();
  }
}