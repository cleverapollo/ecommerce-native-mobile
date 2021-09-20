import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Appsflyer, AppsflyerEvent } from '@ionic-native/appsflyer/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { LogService } from './log.service';
import { AuthProvider } from '@core/models/signup.model';
import { Platform } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  get appsflyerConfigExists(): Boolean {
    const appsflyerConfig = environment.appsflyerConfig;
    return appsflyerConfig ? true : false;
  }

  constructor(
    private appsflyer: Appsflyer, 
    private logger: LogService, 
    private platform: Platform,
    private platformService: PlatformService,
    private firebaseAnalytics: FirebaseAnalytics,
    private angularFireAnalytics: AngularFireAnalytics
    ) { 
  }

  initAppsflyerSdk() {
    if (!this.platformService.isNativePlatform) {return}

    const appsflyerConfig = environment.appsflyerConfig;
    if (appsflyerConfig) {
      this.appsflyer.initSdk({
        devKey: appsflyerConfig.devKey,
        appId: appsflyerConfig.appId
      }).then(() => {
        this.logger.info('initialized appsflyer sdk successful')
      }, () => {
        this.logger.error('initialized appsflyer sdk failed')
      })
    }
  }

  logFirebaseEvent(eventName: string, params: { [prop: string]: any }) {
    if (this.platformService.isNativePlatform) { 
      this.platform.ready().then(() => {
        this.firebaseAnalytics.logEvent(eventName, params);
      })
    } else {
      this.angularFireAnalytics.logEvent(eventName, params);
    }
  }

  logAppsflyerEvent(eventName: string, eventValues: AppsflyerEvent) {
    if (this.appsflyerConfigExists && this.platformService.isNativePlatform) {
      this.appsflyer.logEvent(eventName, eventValues);
    }
  }

  setFirebaseScreenName(screenName: string) {
    if (this.platformService.isNativePlatform) {
      this.firebaseAnalytics.setCurrentScreen(screenName);
    } else {
      this.angularFireAnalytics.setCurrentScreen(screenName);
    }
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;

    if (this.platformService.isNativePlatform) {
      this.firebaseAnalytics.setEnabled(this.analyticsEnabled);
      if (this.appsflyerConfigExists) {
        this.appsflyer.Stop(this.analyticsEnabled);
      }
    } else {
      this.angularFireAnalytics.setAnalyticsCollectionEnabled(this.analyticsEnabled);
    }
  }

  logCompleteRegistrationEvent(authProvider: AuthProvider) {
    const authProviderString: string = AuthProvider[authProvider];
    const appsflyerEvent: AppsflyerEvent = {'af_registration_method': authProviderString};
    this.logAppsflyerEvent('af_complete_registration', appsflyerEvent);
    this.logFirebaseEvent('sign_up', { 'method': authProviderString });
  }

  logLoginEvent(authProvider: AuthProvider) {
    const authProviderString: string = AuthProvider[authProvider];
    this.logAppsflyerEvent('af_login', null);
    this.logFirebaseEvent('login', { 'method': authProviderString });
  }
}
