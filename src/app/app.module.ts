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
import { SERVER_URL, WHITELISTED_DOMAINS } from 'src/environments/environment';
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
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { EmailVerificationStatusResolver } from './email-verification/email-verification-status.resolver';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthenticationService } from '@core/services/authentication.service';

registerLocaleData(localeDe, 'de', localeDeExtra)

export function jwtOptionsFactory(authService: AuthenticationService) {
  return {
    tokenGetter: () => {
      return authService.firebaseAccessToken;
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
    LoggerModule.forRoot({ 
      level: NgxLoggerLevel.DEBUG,
                    //TRACE     DEBUG       INFO      LOG         WARN       ERROR    FATAL
      colorScheme: ['#7D3C98', '#17A589', '#1F618D', '#797D7F', '#F39C12', '#E74C3C', '#E74C3C']
    }),
    NativeHttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Appsflyer,
    InAppBrowser,
    HTTP,
    EmailVerificationStatusResolver,
    Facebook,
    File,
    FirebaseAuthentication,
    FriendsWishListResolver,
    FriendsWishListDetailResolver,
    GooglePlus,
    SharedWishListResolver,
    SignInWithApple,
    UserProfileResolver,
    WishResolver,
    WishListsResolver,
    WishListResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: NativeTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NativeHttpInterceptor, multi: true },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
