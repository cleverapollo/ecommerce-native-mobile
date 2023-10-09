import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { HTTP_INTERCEPTORS, HttpBackend, HttpXhrBackend } from '@angular/common/http';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CoreModule } from '@core/core.module';
import { AuthenticationService } from '@core/services/authentication.service';
import { StorageService } from '@core/services/storage.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { UserProfileResolver } from '@shared/user-profile.resolver';
import { CacheModule } from 'ionic-cache';
import { NativeHttpBackend, NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SERVER_URL, WHITELISTED_DOMAINS } from 'src/environments/environment';
import { environment } from '../environments/environment';
import { NativeHttpInterceptor } from './_interceptors/native-http.interceptor';
import { NativeTokenInterceptor } from './_interceptors/native-token.interceptor';
import { EmailVerificationStatusResolver } from './email-verification/email-verification-status.resolver';

registerLocaleData(localeDe, 'de', localeDeExtra)

export function jwtOptionsFactory(authService: AuthenticationService) {
  return {
    tokenGetter: () => {
      return authService?.setupFirebaseIdToken;
    },
    whitelistedDomains: WHITELISTED_DOMAINS,
    blacklistedRoutes: [`${SERVER_URL}/auth*`]
  }
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
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
      // TRACE     DEBUG       INFO      LOG         WARN       ERROR    FATAL
      colorScheme: ['#7D3C98', '#17A589', '#1F618D', '#797D7F', '#F39C12', '#E74C3C', '#E74C3C']
    }),
    NativeHttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    IonicStorageModule.forRoot()
  ],
  providers: [
    InAppBrowser,
    HTTP,
    EmailVerificationStatusResolver,
    UserProfileResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: NativeTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NativeHttpInterceptor, multi: true },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
