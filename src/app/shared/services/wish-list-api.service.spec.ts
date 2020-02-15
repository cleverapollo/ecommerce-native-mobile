import { TestBed } from '@angular/core/testing';

import { WishListApiService } from './wish-list-api.service';

describe('WishListApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WishListApiService = TestBed.get(WishListApiService);
    expect(service).toBeTruthy();
  });
});
