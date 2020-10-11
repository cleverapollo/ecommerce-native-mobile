import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Injectable()
export class FriendsWishListDetailResolver implements Resolve<Observable<FriendWishList>> {
  constructor(private friendWishListStore: FriendWishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const wishListId = Number(route.paramMap.get('wishListId'));
    return this.friendWishListStore.loadWishList(wishListId);
  }
}