import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Appsflyer, AppsflyerEvent } from '@ionic-native/appsflyer/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { LogService } from './log.service';
import { AuthProvider } from '@core/models/signup.model';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  get appsflyerConfigExists(): Boolean {
    const appsflyerConfig = environment.appsflyerConfig;
    return appsflyerConfig ? true : false;
  }

  get firebaseConfigExists(): Boolean {
    return environment.analyticsConfigured;
  }

  constructor(
    private appsflyer: Appsflyer, 
    private logger: LogService, 
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics
    ) { 
  }

  initAppsflyerSdk() {
    if (!this.platform.is('capacitor')) {return}

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
    if (this.firebaseConfigExists && this.platform.is('capacitor')) { 
      this.platform.ready().then(() => {
        this.firebaseAnalytics.logEvent(eventName, params);
      })
    }
  }

  logAppsflyerEvent(eventName: string, eventValues: AppsflyerEvent) {
    if (this.appsflyerConfigExists && this.platform.is('capacitor')) {
      this.appsflyer.logEvent(eventName, eventValues);
    }
  }

  setFirebaseScreenName(screenName: string) {
    if (this.firebaseConfigExists && this.platform.is('capacitor')) {
      this.firebaseAnalytics.setCurrentScreen(screenName);
    }
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;

    if (this.firebaseConfigExists && this.platform.is('capacitor')) {
      this.firebaseAnalytics.setEnabled(this.analyticsEnabled);
    }

    if (this.appsflyerConfigExists && this.platform.is('capacitor')) {
      this.appsflyer.Stop(this.analyticsEnabled);
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
