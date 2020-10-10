import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Injectable()
export class WishResolver implements Resolve<Observable<WishDto>> {
  constructor(private wishListStore: WishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const wishId = Number(route.paramMap.get('wishId'));
    return this.wishListStore.loadWish(wishId);
  }
}