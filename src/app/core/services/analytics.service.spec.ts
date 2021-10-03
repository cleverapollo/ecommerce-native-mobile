import { TestBed } from '@angular/core/testing';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';

import { AnalyticsService } from './analytics.service';
import { LogService } from './log.service';
import { PlatformService } from './platform.service';

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
        { provide: Appsflyer, useValue: appsflyer },
        { provide: LogService, useValue: logger },
        { provide: Platform, useValue: platform },
        { provide: PlatformService, useValue: platformService },
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
