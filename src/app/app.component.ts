import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CacheService } from 'ionic-cache';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { WishListDetailPage } from '@wishLists/wish-list-detail/wish-list-detail.page';
import { AccountFirstNamePage } from '@registration/account-first-name/account-first-name.page';
import { ChangePasswordPage } from './forgot-password/change-password/change-password.page';
import { SharedWishListPage } from '@wishLists/shared-wish-list/shared-wish-list.page';
import { EmailConfirmationPage } from '@registration/email-confirmation/email-confirmation.page';

import { Plugins, StatusBarStyle } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private cache: CacheService,
    private deeplinks: Deeplinks,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {
        StatusBar.setStyle({ style: StatusBarStyle.Light })
        SplashScreen.hide();
        this.initDeeplinks();
      }
      this.initCache();
      console.log(environment.debugMessage);
    });
  }

  private initCache() {
    this.cache.setDefaultTTL(60 * 60);
    this.cache.setOfflineInvalidate(false);
  }

  private initDeeplinks() {
    this.deeplinks.routeWithNavController(this.navController, {
      '/secure/home/wish-list/:wishListId': WishListDetailPage,
      '/registration/first-name': AccountFirstNamePage,
      '/forgot-password/change-password': ChangePasswordPage,
      '/shared-wish-list': SharedWishListPage,
      '/email-confirmation': EmailConfirmationPage
    }).subscribe({
      next: deeplink => { console.log('Successfully matched route', deeplink); },
      error: console.error 
    })
  }


}
