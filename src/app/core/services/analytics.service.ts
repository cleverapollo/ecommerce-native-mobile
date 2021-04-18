import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Plugins } from "@capacitor/core";

const { FirebaseAnalytics, Device } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  constructor() { 
    if (environment.analyticsConfigured) {
      this.initFb();
    }
  }

  async initFb() {
    if ((await Device.getInfo()).platform == 'web') {
      FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
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
