import { TestBed } from '@angular/core/testing';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';
import { AppsFlyer } from 'appsflyer-capacitor-plugin';

import { AnalyticsService } from './analytics.service';
import { Logger } from './log.service';
import { DefaultPlatformService } from './platform.service';

describe('AnalyticsService', () => {

  const appsflyer = {};
  const logger = {};
  const platform = {};
  const platformService = {};
  const firebaseAnalytics = {};
  const angularFireAnalytics = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppsFlyer, useValue: appsflyer },
        { provide: Logger, useValue: logger },
        { provide: Platform, useValue: platform },
        { provide: DefaultPlatformService, useValue: platformService },
        { provide: FirebaseAnalytics, useValue: firebaseAnalytics },
        { provide: AngularFireAnalytics, useValue: angularFireAnalytics }
      ]
    })
  });

  it('should be created', () => {
    const service: AnalyticsService = TestBed.inject(AnalyticsService);
    expect(service).toBeTruthy();
  });
});
