import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { FriendWishList } from '@core/models/wish-list.model';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable()
export class SharedWishListResolver implements Resolve<Promise<{ wishList: FriendWishList }>> {

  constructor(
    private wishListApi: WishListApiService,
    private publicResourceApiService: PublicResourceApiService,
    private platformService: DefaultPlatformService,
    private friendWishListStore: FriendWishListStoreService,
    private wishListStore: WishListStoreService,
    private router: Router
    ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<{ wishList: FriendWishList }> {
    return new Promise<{ wishList: FriendWishList }>(async (resolve, reject) => {
      const wishListId = route.paramMap.get('wishListId');
      try {
        if (this.platformService.isNativePlatform) {
          if (await this.isFriendWishList(wishListId)) {
            this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}`)
          } else if (await this.isOwnWishList(wishListId)) {
            this.router.navigateByUrl(`/secure/home/wish-list/${wishListId}`)
          } else {
            this.wishListApi.acceptInvitation(wishListId).finally(() => {
              this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}?forceRefresh=true`);
            });
          }
        } else {
          const wishList = await this.publicResourceApiService.getSharedWishList(wishListId).toPromise();
          resolve({ wishList });
        }
      } catch (error) {
        reject(error)
      }
    });
  }

  private async isFriendWishList(wishListId: string) {
    try {
      const wishLists = await this.friendWishListStore.loadWishLists().toPromise();
      const wishList = wishLists.find((w) => w.id === wishListId);
      return wishList !== undefined;
    } catch (error) {
      return false;
    }
  }

  private async isOwnWishList(wishListId: string): Promise<boolean> {
    return this.wishListStore.loadWishList(wishListId).pipe(
      take(1),
      catchError(() => { return of(false); }),
      map(wishList => { return wishList !== null; })
    ).toPromise();
  }

}