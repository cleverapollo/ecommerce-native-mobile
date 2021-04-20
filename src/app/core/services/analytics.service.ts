import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Plugins } from "@capacitor/core";
import { Appsflyer, AppsflyerEvent } from '@ionic-native/appsflyer/ngx';
import { LogService } from './log.service';

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

  constructor(private appsflyer: Appsflyer, private logger: LogService) { 
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

  logFirebaseEvent(event: { [prop: string]: any }) {
    if (this.firebaseIsConfigured) {
      FirebaseAnalytics.logEvent(event);
    }
  }

  logAppsflyerEvent(eventName: string, eventValues: AppsflyerEvent) {
    if (this.appsflyerIsConfigured) {
      this.appsflyer.logEvent(eventName, eventValues);
    }
  }

  setFirebaseScreenName(screenName: string) {
    if (this.firebaseIsConfigured) { 
      FirebaseAnalytics.setScreenName({
        screenName
      });
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
}
