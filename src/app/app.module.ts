import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { HTTP_INTERCEPTORS, HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { WishListsResolver } from '@wishLists/home/wish-lists.resolver';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de'
import localeDeExtra from '@angular/common/locales/extra/de';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FriendsWishListResolver } from '@friends/friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from '@shared/user-profile.resolver';
import { EmailVerificationResolver } from '@registration/email-confirmation/email-verification.resolver';
import { SERVER_URL, WHITELISTED_DOMAINS } from 'src/environments/environment';
import { HttpRequestLoadingInterceptor } from './_interceptors/http-loading.interceptor';
import { SharedWishListResolver } from '@wishLists/shared-wish-list/shared-wish-list.resolver';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { CoreModule } from '@core/core.module';
import { CacheModule } from "ionic-cache";
import { WishListResolver } from '@wishLists/home/wish-list.resolver';
import { WishResolver } from '@wishLists/home/wish.resolver';
import { FriendsWishListDetailResolver } from '@friends/friends-wish-list-detail/friends-wish-list-detail.resolver';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { NativeHttpInterceptor } from './_interceptors/native-http.interceptor';
import { NativeTokenInterceptor } from './_interceptors/native-token.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(localeDe, 'de', localeDeExtra)

export function jwtOptionsFactory(storageService: StorageService) {
  return {
    tokenGetter: () => {
      console.log('jwtOptionsFactory tokenGetter');
      return storageService.get(StorageKeys.AUTH_TOKEN, true);
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
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [StorageService]
      },
    }),
    NativeHttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    InAppBrowser,
    HTTP,
    EmailVerificationResolver,
    File,
    FriendsWishListResolver,
    FriendsWishListDetailResolver,
    SharedWishListResolver,
    UserProfileResolver,
    WishResolver,
    WishListsResolver,
    WishListResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: NativeTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestLoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NativeHttpInterceptor, multi: true },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
