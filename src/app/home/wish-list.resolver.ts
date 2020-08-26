import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListDto } from '../shared/models/wish-list.model';
import { WishListApiService } from '../shared/api/wish-list-api.service';

@Injectable()
export class WishListResolver implements Resolve<Observable<Array<WishListDto>>> {
  constructor(private wishListService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishLists('DASHBOARD');
  }
}