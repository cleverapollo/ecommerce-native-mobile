import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Injectable()
export class WishListResolver implements Resolve<Observable<WishListDto | null>> {

  constructor(private wishListStore: WishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const wishListId = route.paramMap.get('wishListId');
    if (!wishListId) {
      return throwError('Required wish list id is missing!');
    }
    const forceRefresh = Boolean(route.queryParamMap.get('forceRefresh')) ?? false;
    return this.wishListStore.loadWishList(wishListId, forceRefresh);
  }
}