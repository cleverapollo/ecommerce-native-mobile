import { TestBed } from '@angular/core/testing';

import { SearchResultDataService } from './search-result-data.service';

describe('SearchResultDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: SearchResultDataService = TestBed.inject(SearchResultDataService);
    expect(service).toBeTruthy();
  });
});
