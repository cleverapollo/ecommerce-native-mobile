import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Plugins } from "@capacitor/core";
import { Appsflyer, AppsflyerEvent } from '@ionic-native/appsflyer/ngx';
import { LogService } from './log.service';
import { AuthProvider } from '@core/models/signup.model';
import { Platform } from '@ionic/angular';

const { FirebaseAnalytics, Device } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  get appsflyerIsConfigured(): Boolean {
    const appsflyerConfig = environment.appsflyerConfig;
    return appsflyerConfig ? true : false;
  }

  get firebaseIsConfigured(): Boolean {
    return environment.analyticsConfigured;
  }

  constructor(private appsflyer: Appsflyer, private logger: LogService, private platform: Platform) { 
    this.initFirebaseSdk();
  }

  async initFirebaseSdk() {
    if ((await Device.getInfo()).platform == 'web' && this.firebaseIsConfigured) {
      FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
    }
  }

  initAppsflyerSdk() {
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
    if (this.firebaseIsConfigured) { 
      this.platform.ready().then(() => {
        const event = {
          name: eventName,
          params: params
        };
        FirebaseAnalytics?.logEvent(event);
      })
    }
  }

  logAppsflyerEvent(eventName: string, eventValues: AppsflyerEvent) {
    if (this.appsflyerIsConfigured) {
      this.appsflyer.logEvent(eventName, eventValues);
    }
  }

  setFirebaseScreenName(screenName: string) {
    if (this.firebaseIsConfigured) { 
      this.platform.ready().then(() => {
        FirebaseAnalytics?.setScreenName({
          screenName
        });
      })
    }
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;

    if (this.firebaseIsConfigured) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: this.analyticsEnabled,
      });
    }

    if (this.appsflyerIsConfigured) {
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
