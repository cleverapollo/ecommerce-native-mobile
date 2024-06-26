import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { Observable } from 'rxjs';
import { APP_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedWishListAccessGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private platform: PlatformService,
    private browserService: BrowserService,
    private friendWishListStore: FriendWishListStoreService,
    private wishListStore: WishListStoreService,
    private router: Router,
    private logger: Logger
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.platform.isWeb) {
      return true
    }

    const wishListId = route.paramMap.get('wishListId');
    if (this.authService.isAuthenticated && wishListId) {
      return this.redirect(wishListId);
    } else {
      const urlString = route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
      this.browserService.openSystemBrowser(`${APP_URL}/${urlString}`);
    }
    return false;
  }

  /**
   * Navigates the user to the detail page of the wish list.
   * Currently this pages are only activated for iOS and Android.
   * @param wishListId Id of the wish list to load.
   * @returns A Promise that resolves to 'true' when navigation succeeds,
   * to 'false' when navigation fails, or is rejected on error.
   */
  private async redirect(wishListId: string): Promise<boolean> {
    this.logger.info('Redirect to page');
    try {
      if (await (this.friendWishListStore.isSharedWishList(wishListId))) {
        this.logger.info('Redirect to shared wish list page');
        return await this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}`);
      }

      if (await (this.wishListStore.isCreatedWishList(wishListId))) {
        this.logger.info('Redirect to wish list page');
        return await this.router.navigateByUrl(`/secure/home/wish-list/${wishListId}`);
      }

      await this.wishListStore.followWishList(wishListId);
      this.friendWishListStore.clearCache();
      return await this.router.navigateByUrl(`/secure/friends-home/wish-list/${wishListId}`);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

}
