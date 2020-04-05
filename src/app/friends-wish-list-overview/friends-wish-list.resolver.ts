import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListDto } from '../shared/models/wish-list.model';
import { WishlistService } from '../home/wishlist.service';

@Injectable()
export class FriendsWishListResolver implements Resolve<Observable<Array<WishListDto>>> {
  constructor(private wishListService: WishlistService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishLists('FRIENDS');
  }
}