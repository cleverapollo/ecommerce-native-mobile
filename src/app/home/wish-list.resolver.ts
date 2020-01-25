import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishlistService } from './wishlist.service';
import { WishList } from './wishlist.model';

@Injectable()
export class WishListResolver implements Resolve<Observable<Array<WishList>>> {
  constructor(private wishListService: WishlistService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishLists('DASHBOARD');
  }
}