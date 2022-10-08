import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { FriendWishList } from '@core/models/wish-list.model';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Injectable()
export class SharedWishListResolver implements Resolve<Promise<{ wishList: FriendWishList}>> {

  constructor(
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
          await this.navigateToDetailPage(wishListId);
          return;
        }

        const wishList = await this.friendWishListStore.loadWishList(wishListId).toPromise();
        resolve({ wishList });
      } catch (error) {
        reject(error)
      }
    });
  }

  /**
   * Navigates the user to the detail page of the wish list.
   * Currently this pages are only activated for iOS and Android.
   * @param wishListId Id of the wish list to load.
   * @returns A Promise that resolves to 'true' when navigation succeeds,
   * to 'false' when navigation fails, or is rejected on error.
   */
  private async navigateToDetailPage(wishListId: string): Promise<boolean> {
    try {
      const isSharedWishList = await this.isSharedWishList(wishListId);
      if (isSharedWishList) {
        return await this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}`);
      }

      const isCreatedWishList = await this.isCreatedWishList(wishListId);
      if (isCreatedWishList) {
        return await this.router.navigateByUrl(`/secure/home/wish-list/${wishListId}`);
      }

      await this.wishListStore.followWishList(wishListId);
      await this.friendWishListStore.removeCachedWishLists();
      return await this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}?forceRefresh=true`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Is this a wish list from a friend?
   * @param wishListId Id of the wish list.
   * @returns True or false
   */
  private async isSharedWishList(wishListId: string): Promise<boolean> {
    try {
      const wishLists = await this.friendWishListStore.loadWishLists().toPromise();
      const wishList = wishLists.find((w) => w.id === wishListId);
      return wishList !== undefined;
    } catch (error) {
      return false;
    }
  }

  /**
   * Is this a wish list created by the user?
   * @param wishListId Id of the wish list.
   * @returns True or false
   */
  private async isCreatedWishList(wishListId: string): Promise<boolean> {
    try {
      const wishLists = await this.wishListStore.loadWishLists().toPromise();
      const wishList = wishLists.find((w) => w.id === wishListId);
      return wishList !== undefined;
    } catch (error) {
      return false;
    }
  }

}