import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishlistService } from './wishlist.service';
import { WishListDto } from '../shared/models/wish-list.model';

@Injectable()
export class WishListResolver implements Resolve<Observable<Array<WishListDto>>> {
  constructor(private wishListService: WishlistService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishLists('DASHBOARD');
  }
}