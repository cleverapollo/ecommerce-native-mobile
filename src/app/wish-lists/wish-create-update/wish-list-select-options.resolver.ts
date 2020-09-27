import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListSelectOptionDto } from '@core/models/wish-list.model';

@Injectable()
export class WishListSelectOptionsResolver implements Resolve<Observable<Array<WishListSelectOptionDto>>> {
  constructor(private wishListService: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.wishListService.getWishListSelectOptions();
  }
}