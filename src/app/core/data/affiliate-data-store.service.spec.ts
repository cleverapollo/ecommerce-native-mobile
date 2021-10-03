import { TestBed } from '@angular/core/testing';
import { AffiliateApiService } from '@core/api/affiliate-api.service';
import { LogService } from '@core/services/log.service';
import { CacheService } from 'ionic-cache';

import { AffiliateDataStoreService } from './affiliate-data-store.service';

describe('AffiliateDataStoreService', () => {

  let api: any;
  let cache: any;
  let logger: any;
  let service: AffiliateDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AffiliateApiService, useValue: api },
        { provide: CacheService, useValue: cache },
        { provide: LogService, useValue: logger }
      ]
    });
    service = TestBed.inject(AffiliateDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
