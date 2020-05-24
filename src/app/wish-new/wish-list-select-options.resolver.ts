import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListSelectOptionDto } from '../shared/models/wish-list.model';

@Injectable()
export class WishListSelectOptionsResolver implements Resolve<Observable<Array<WishListSelectOptionDto>>> {
  constructor(private wishListService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishListSelectOptions();
  }
}