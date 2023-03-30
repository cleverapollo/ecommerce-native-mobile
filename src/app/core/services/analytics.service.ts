import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { SearchResult } from '@core/models/search-result-item';
import { AuthProvider } from '@core/models/signup.model';
import { WishDto } from '@core/models/wish-list.model';
import { Platform } from '@ionic/angular';
import { AFInit, AppsFlyer } from 'appsflyer-capacitor-plugin';
import { Logger } from './log.service';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  get appsflyerConfigExists(): boolean {
    const appsflyerConfig = environment.appsflyerConfig;
    return appsflyerConfig ? true : false;
  }

  constructor(
    private logger: Logger,
    private platform: Platform,
    private platformService: PlatformService,
    private angularFireAnalytics: AngularFireAnalytics
  ) {
  }

  initAppsflyerSdk() {
    if (!this.platformService.isNativePlatform) { return }

    const appsflyerConfig: AFInit = environment.appsflyerConfig;
    if (appsflyerConfig) {
      AppsFlyer.initSDK(appsflyerConfig).then(res => {
        this.logger.debug(JSON.stringify(res));
        this.logger.info('initialized appsflyer sdk successful');
      }, error => {
        this.logger.error('initialized appsflyer sdk failed');
        this.logger.error(error);
      })
    }
  }

  logFirebaseEvent(eventName: string, params: { [prop: string]: any }) {
    if (this.platformService.isNativePlatform) {
      this.platform.ready().then(() => {
        FirebaseAnalytics.logEvent({ name: eventName, params });
      })
    } else {
      this.angularFireAnalytics.logEvent(eventName, params);
    }
  }

  logAppsflyerEvent(eventName: string, eventValue: any) {
    if (this.appsflyerConfigExists && this.platformService.isNativePlatform) {
      AppsFlyer.logEvent({
        eventName,
        eventValue
      });
    }
  }

  setFirebaseScreenName(screenName: string) {
    if (this.platformService.isNativePlatform) {
      FirebaseAnalytics.setScreenName({
        screenName
      });
    } else {
      this.angularFireAnalytics.setCurrentScreen(screenName);
    }
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;

    if (this.platformService.isNativePlatform) {
      FirebaseAnalytics.setCollectionEnabled({ enabled: this.analyticsEnabled });
      if (this.appsflyerConfigExists) {
        AppsFlyer.stop({
          stop: true
        });
      }
    } else {
      this.angularFireAnalytics.setAnalyticsCollectionEnabled(this.analyticsEnabled);
    }
  }

  logCompleteRegistrationEvent(authProvider: AuthProvider) {
    const authProviderString: string = AuthProvider[authProvider];
    const eventValue = { af_registration_method: authProviderString };
    this.logAppsflyerEvent('af_complete_registration', eventValue);
    this.logFirebaseEvent('sign_up', { method: authProviderString });
  }

  logLoginEvent(authProvider: AuthProvider) {
    const authProviderString: string = AuthProvider[authProvider];
    this.logAppsflyerEvent('af_login', null);
    this.logFirebaseEvent('login', { method: authProviderString });
  }

  logSearchResultEvent(searchResult: SearchResult, searchString: string) {
    this.logAppsflyerEvent('af_search', {
      af_search_string: searchString,
      af_content_list: searchResult.items.map(item => item.asin)
    });
    this.logFirebaseEvent('search', {
      search_term: searchString,
      items: searchResult.items.map(item => {
        return {
          item_id: item.asin,
          item_name: item.name,
          price: item.price
        };
      })
    });
  }

  logSearchEvent(searchString: string) {
    this.logAppsflyerEvent('af_search', {
      af_search_string: searchString
    });
    this.logFirebaseEvent('search', {
      search_term: searchString
    });
  }

  logAddToWishListEvent(wish: WishDto) {
    this.logAppsflyerEvent('af_add_to_wishlist', {
      af_price: wish.price.amount,
      af_content_id: wish.asin,
      af_currency: wish.price.currency
    });
    this.logFirebaseEvent('add_to_wishlist', {
      content_id: wish.asin,
      value: wish.price.amount,
      currency: wish.price.currency,
    });
  }
}
