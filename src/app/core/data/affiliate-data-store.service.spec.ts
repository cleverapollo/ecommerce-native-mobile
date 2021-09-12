import { TestBed } from '@angular/core/testing';

import { AffiliateDataStoreService } from './affiliate-data-store.service';

describe('AffiliateDataStoreService', () => {
  let service: AffiliateDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliateDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
