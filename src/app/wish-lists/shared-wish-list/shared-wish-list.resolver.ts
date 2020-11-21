import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Injectable()
export class SharedWishListResolver implements Resolve<Promise<FriendWishList>> {
  constructor(
    private wishListApi: WishListApiService, 
    private storageService: StorageService,
    private authService: AuthenticationService,
    private userProfileStore: UserProfileStore
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    return new Promise<FriendWishList>((resolve, reject) => {
      let identifier = route.queryParams.identifier;
      this.getEmail().then((email => {
        if (email) {
          identifier += `_${email}`;
        }
        this.wishListApi.getSharedWishList(identifier).toPromise().then(resolve).catch(reject);
      }));
    });
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