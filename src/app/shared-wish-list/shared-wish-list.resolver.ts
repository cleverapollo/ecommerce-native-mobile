import { Injectable } from '@angular/core';
import { SharedWishListDto } from '../friends-wish-list-overview/friends-wish-list-overview.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WishListApiService } from '../shared/api/wish-list-api.service';

@Injectable()
export class SharedWishListResolver implements Resolve<Observable<SharedWishListDto>> {
  constructor(private wishListApi: WishListApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    return this.wishListApi.getSharedWishList(route.queryParams.identifier);
  }
}