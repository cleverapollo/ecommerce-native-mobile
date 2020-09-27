import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';

@Injectable()
export class FriendsWishListResolver implements Resolve<Observable<Array<WishListDto>>> {
  constructor(private wishListService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishLists('FRIENDS');
  }
}