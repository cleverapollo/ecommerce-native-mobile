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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WishListResolver } from './home/wish-list.resolver';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de'
import localeDeExtra from '@angular/common/locales/extra/de';
import { WishListSelectOptionsResolver } from './wish-create-update/wish-list-select-options.resolver';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FriendsWishListResolver } from './friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from './shared/user-profile.resolver';
import { FriendSelectOptionsResolver } from './wish-list-create-update/friend-list-select-options.resolver';
import { EmailVerificationResolver } from './email-confirmation/email-verification.resolver';
import { SERVER_URL, WHITELISTED_DOMAINS } from 'src/environments/environment';
import { HttpRequestLoadingInterceptor } from './_interceptors/http-loading.interceptor';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SharedWishListResolver } from './shared-wish-list/shared-wish-list.resolver';
import { Keychain } from '@ionic-native/keychain/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { StorageKeys } from './shared/services/storage.service';

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
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
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
    FriendSelectOptionsResolver,
    FriendsWishListResolver,
    Keyboard,
    Keychain,
    SecureStorage,
    SharedWishListResolver,
    SocialSharing,
    UserProfileResolver,
    WishListResolver,
    WishListSelectOptionsResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestLoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
