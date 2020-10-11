import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListDto } from '@core/models/wish-list.model';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { FriendWishList } from './friends-wish-list-overview.model';

@Injectable()
export class FriendsWishListResolver implements Resolve<Observable<Array<FriendWishList>>> {
  constructor(private friendWishListStore: FriendWishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.friendWishListStore.loadWishLists();
  }
}