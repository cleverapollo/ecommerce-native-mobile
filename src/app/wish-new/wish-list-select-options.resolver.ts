import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListApiService } from '../shared/services/wish-list-api.service';
import { WishListSelectOption } from '../home/wishlist.model';

@Injectable()
export class WishListSelectOptionsResolver implements Resolve<Observable<Array<WishListSelectOption>>> {
  constructor(private wishListService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishListSelectOptions();
  }
}