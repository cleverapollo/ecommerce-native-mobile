import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Plugins } from "@capacitor/core";
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { LogService } from './log.service';

const { FirebaseAnalytics, Device } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  constructor(private appsflyer: Appsflyer, private logger: LogService) { 
    this.initFirebaseSdk();
  }

  async initFirebaseSdk() {
    if ((await Device.getInfo()).platform == 'web' && environment.analyticsConfigured) {
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

  logEvent(event: { [prop: string]: any }) {
    if (environment.analyticsConfigured) {
      FirebaseAnalytics.logEvent(event);
    }
  }

  setScreenName(screenName: string) {
    if (environment.analyticsConfigured) { 
      FirebaseAnalytics.setScreenName({
        screenName
      });
    }
  }

  toggleAnalytics() {
    if (environment.analyticsConfigured) { 
      this.analyticsEnabled = !this.analyticsEnabled;
      FirebaseAnalytics.setCollectionEnabled({
        enabled: this.analyticsEnabled,
      });    
    }
  }
}
