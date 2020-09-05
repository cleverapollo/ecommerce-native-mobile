import { TestBed } from '@angular/core/testing';

import { SearchResultDataService } from './search-result-data.service';

describe('SearchResultDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchResultDataService = TestBed.get(SearchResultDataService);
    expect(service).toBeTruthy();
  });
});
