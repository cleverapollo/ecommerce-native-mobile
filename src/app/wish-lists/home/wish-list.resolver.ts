import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Injectable()
export class WishListResolver implements Resolve<Observable<WishListDto>> {
  constructor(private wishListStore: WishListStoreService, private wishListApiService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const acceptInvitation = Boolean(route.queryParamMap.get('acceptInvitation'));
    const wishListId = route.paramMap.get('wishListId');
    if (acceptInvitation) {
      return this.acceptInvitationAndLoadWishLists(wishListId);
    } else {
      const forceRefresh = Boolean(route.queryParamMap.get('forceRefresh')) ?? false;
      return this.wishListStore.loadWishList(wishListId, forceRefresh);
    }
  }

  private acceptInvitationAndLoadWishLists(wishListId: string): Observable<WishListDto> {
    return from(new Promise<WishListDto>((resolve, reject) => {
      this.wishListApiService.acceptInvitation(wishListId).finally(() => {
         this.wishListStore.loadWishList(wishListId).toPromise().then(wishList => {
           this.wishListStore.saveWishListToCache(wishList);
           resolve(wishList);
         }, reject)
      });
    }));
  }
}