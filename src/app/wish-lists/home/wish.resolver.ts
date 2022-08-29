import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { WishDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class WishResolver implements Resolve<Observable<WishDto | null>> {
  constructor(private wishListStore: WishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const wishId = route.paramMap.get('wishId');
    if (wishId) {
      return this.wishListStore.loadWish(wishId);
    }
    return of(null);
  }
}