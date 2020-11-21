import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { StorageService } from '@core/services/storage.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Injectable()
export class SharedWishListResolver implements Resolve<Promise<FriendWishList>> {
  constructor(private wishListApi: WishListApiService, private storageService: StorageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    return new Promise<FriendWishList>((resolve, reject) => {
      let identifier = route.queryParams.identifier;
      this.storageService.get<string>('SHARED_WISH_LIST_EMAIL').then((storedEmail) => {
        if (storedEmail) {
          identifier += `_${storedEmail}`;
        }
        this.wishListApi.getSharedWishList(identifier).toPromise().then(resolve).catch(reject);
      })
    })
  }
}