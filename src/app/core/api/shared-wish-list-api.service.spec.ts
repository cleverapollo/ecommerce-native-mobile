import { TestBed } from '@angular/core/testing';

import { SharedWishListApiService } from './shared-wish-list-api.service';

describe('SharedWishListApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: SharedWishListApiService = TestBed.inject(SharedWishListApiService);
    expect(service).toBeTruthy();
  });
});
