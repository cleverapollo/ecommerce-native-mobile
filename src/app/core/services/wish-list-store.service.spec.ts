import { TestBed } from '@angular/core/testing';

import { WishListStoreService } from './wish-list-store.service';

describe('WishListStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WishListStoreService = TestBed.get(WishListStoreService);
    expect(service).toBeTruthy();
  });
});
