import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Injectable()
export class SharedWishListResolver implements Resolve<Promise<{ wishList: FriendWishList, email?: string }>> {
  constructor(
    private wishListApi: WishListApiService, 
    private storageService: StorageService,
    private authService: AuthenticationService,
    private userProfileStore: UserProfileStore,
    private friendWishListStore: FriendWishListStoreService,
    private wishListStore: WishListStoreService,
    private router: Router
    ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<{ wishList: FriendWishList, email?: string }> {
    return new Promise<{ wishList: FriendWishList, email?: string }>(async (resolve, reject) => {
      let identifier = route.queryParams.identifier;
      try {
        const wishListId = Number(identifier.split('_')[0]);
        if (await this.isFriendWishList(wishListId)) {
          this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}`)
        } else if (await this.isOwnWishList(wishListId)) {
          this.router.navigateByUrl(`/secure/home/wish-list/${wishListId}`)
        } else {
          const currentEmail = await this.getEmail();
          if (currentEmail) {
            identifier += `_${currentEmail}`;
          }
          const wishList = await this.wishListApi.getSharedWishList(identifier).toPromise();
          resolve({ wishList: wishList, email: currentEmail });
        }
      } catch (error) {
        reject(error)
      }
    });
  }

  private async isFriendWishList(wishListId: Number) {
    try {
      const isAuthenticated = await this.authService.isAuthenticated.toPromise();
      if (isAuthenticated) {
        const wishLists = await this.friendWishListStore.loadWishLists().toPromise();
        const wishList = wishLists.find((wishList) => wishList.id === wishListId);
        return wishList !== undefined;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async isOwnWishList(wishListId: Number) {
    try {
      const isAuthenticated = await this.authService.isAuthenticated.toPromise();
      if (isAuthenticated) {
        const wishLists = await this.wishListStore.loadWishLists().toPromise();
        const wishList = wishLists.find((wishList) => wishList.id === wishListId);
        return wishList !== undefined;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async getEmail() {
    let isAuthenticated = await this.authService.isAuthenticated.toPromise();
    if (isAuthenticated) {
      let userProfile = await this.userProfileStore.loadUserProfile().toPromise();
      await this.storageService.set(StorageKeys.SHARED_WISH_LIST_EMAIL, userProfile.email, true);
      return userProfile.email;
    } 
    return await this.storageService.get<string>(StorageKeys.SHARED_WISH_LIST_EMAIL, true);
  }

}