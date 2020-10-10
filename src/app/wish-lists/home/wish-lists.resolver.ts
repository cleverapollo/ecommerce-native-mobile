import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Injectable()
export class WishListsResolver implements Resolve<Observable<Array<WishListDto>>> {
  constructor(private wishListStore: WishListStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListStore.loadWishLists();
  }
}