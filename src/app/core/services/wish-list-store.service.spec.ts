import { TestBed } from '@angular/core/testing';

import { WishListStoreService } from './wish-list-store.service';

describe('WishListStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: WishListStoreService = TestBed.inject(WishListStoreService);
    expect(service).toBeTruthy();
  });
});
