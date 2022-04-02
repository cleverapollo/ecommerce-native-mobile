import { TestBed } from '@angular/core/testing';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';
import { AppsFlyer } from 'appsflyer-capacitor-plugin';

import { AnalyticsService } from './analytics.service';
import { LogService } from './log.service';
import { DefaultPlatformService } from './platform.service';

describe('AnalyticsService', () => {

  let appsflyer;
  let logger;
  let platform;
  let platformService;
  let firebaseAnalytics;
  let angularFireAnalytics;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppsFlyer, useValue: appsflyer },
        { provide: LogService, useValue: logger },
        { provide: Platform, useValue: platform },
        { provide: DefaultPlatformService, useValue: platformService },
        { provide: FirebaseAnalytics, useValue: firebaseAnalytics },
        { provide: AngularFireAnalytics, useValue: angularFireAnalytics }
      ]
    })
  });

  it('should be created', () => {
    const service: AnalyticsService = TestBed.get(AnalyticsService);
    expect(service).toBeTruthy();
  });
});
