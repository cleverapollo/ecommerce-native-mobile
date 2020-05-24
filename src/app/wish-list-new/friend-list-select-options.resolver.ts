import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FriendApiService } from '../shared/api/friend-api.service';
import { FriendSelectOption } from '../shared/models/friend.model';

@Injectable()
export class FriendSelectOptionsResolver implements Resolve<Observable<Array<FriendSelectOption>>> {
  constructor(private friendApiService: FriendApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.friendApiService.query('SELECTION');
  }
}