import { TestBed } from '@angular/core/testing';

import { AffiliateApiService } from './affiliate-api.service';

describe('AffiliateApiService', () => {
  let service: AffiliateApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
