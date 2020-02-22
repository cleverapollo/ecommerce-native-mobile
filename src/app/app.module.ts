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
import { HttpClientModule } from '@angular/common/http';
import { WishListResolver } from './home/wish-list.resolver';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de'
import localeDeExtra from '@angular/common/locales/extra/de';
import { WishListSelectOptionsResolver } from './wish-new/wish-list-select-options.resolver';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

registerLocaleData(localeDe, 'de', localeDeExtra)

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('auth-token');
    },
    whitelistedDomains: ['127.0.0.1:8080'],
    blacklistedRoutes: ['127.0.0.1:8080/auth*']
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
    WishListResolver,
    WishListSelectOptionsResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
