import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Plugins } from "@capacitor/core";
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
const { FirebaseAnalytics, Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  analyticsEnabled = true;

  constructor(private router: Router) { 
    if (environment.analyticsConfigured) {
      this.initFb();
      this.router.events.pipe(
        filter((e: RouterEvent) => e instanceof NavigationEnd),
      ).subscribe((e: RouterEvent) => {
        this.setScreenName(e.url)
      });
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

  setScreenName(screenName) {
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
