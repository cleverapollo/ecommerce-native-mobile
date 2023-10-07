import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { AppsFlyer } from 'appsflyer-capacitor-plugin';

import { AnalyticsService } from './analytics.service';
import { Logger } from './log.service';
import { PlatformService } from './platform.service';

describe('AnalyticsService', () => {

  const appsflyer = {};
  const logger = {};
  const platform = {};
  const platformService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppsFlyer, useValue: appsflyer },
        { provide: Logger, useValue: logger },
        { provide: Platform, useValue: platform },
        { provide: PlatformService, useValue: platformService }
      ]
    })
  });

  it('should be created', () => {
    const service: AnalyticsService = TestBed.inject(AnalyticsService);
    expect(service).toBeTruthy();
  });
});
