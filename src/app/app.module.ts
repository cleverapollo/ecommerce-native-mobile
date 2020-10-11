import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WishListsResolver } from '@wishLists/home/wish-lists.resolver';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de'
import localeDeExtra from '@angular/common/locales/extra/de';
import { WishListSelectOptionsResolver } from '@wishLists/wish-create-update/wish-list-select-options.resolver';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FriendsWishListResolver } from '@friends/friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from '@shared/user-profile.resolver';
import { EmailVerificationResolver } from '@registration/email-confirmation/email-verification.resolver';
import { SERVER_URL, WHITELISTED_DOMAINS } from 'src/environments/environment';
import { HttpRequestLoadingInterceptor } from './_interceptors/http-loading.interceptor';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SharedWishListResolver } from '@wishLists/shared-wish-list/shared-wish-list.resolver';
import { Keychain } from '@ionic-native/keychain/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { StorageKeys } from '@core/services/storage.service';
import { CoreModule } from '@core/core.module';
import { CacheModule } from "ionic-cache";
import { WishListResolver } from '@wishLists/home/wish-list.resolver';
import { WishResolver } from '@wishLists/home/wish.resolver';
import { FriendsWishListDetailResolver } from '@friends/friends-wish-list-detail/friends-wish-list-detail.resolver';

registerLocaleData(localeDe, 'de', localeDeExtra)

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get(StorageKeys.AUTH_TOKEN);
    },
    whitelistedDomains: WHITELISTED_DOMAINS,
    blacklistedRoutes: [`${SERVER_URL}/auth*`]
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CoreModule,
    CacheModule.forRoot({ keyPrefix: 'wantic-app-cache' }),
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      },
    })
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    EmailVerificationResolver,
    FriendsWishListResolver,
    FriendsWishListDetailResolver,
    Keyboard,
    Keychain,
    SecureStorage,
    SharedWishListResolver,
    SocialSharing,
    UserProfileResolver,
    WishResolver,
    WishListsResolver,
    WishListResolver,
    WishListSelectOptionsResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestLoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
