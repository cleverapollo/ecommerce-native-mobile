import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: SearchService = TestBed.inject(SearchService);
    expect(service).toBeTruthy();
  });
});
