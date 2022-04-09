import { TestBed } from '@angular/core/testing';

import { WishApiService } from './wish-api.service';

describe('WishApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: WishApiService = TestBed.inject(WishApiService);
    expect(service).toBeTruthy();
  });
});
