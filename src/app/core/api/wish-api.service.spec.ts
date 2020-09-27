import { TestBed } from '@angular/core/testing';

import { WishApiService } from './wish-api.service';

describe('WishApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WishApiService = TestBed.get(WishApiService);
    expect(service).toBeTruthy();
  });
});
