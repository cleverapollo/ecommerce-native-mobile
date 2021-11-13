import { TestBed } from '@angular/core/testing';

import { UrlSearchDataStoreService } from './url-search-data-store.service';

describe('UrlSearchDataStoreService', () => {
  let service: UrlSearchDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlSearchDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
