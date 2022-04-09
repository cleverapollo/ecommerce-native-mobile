import { TestBed } from '@angular/core/testing';

import { FriendWishListStoreService } from './friend-wish-list-store.service';

describe('FriendWishListStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: FriendWishListStoreService = TestBed.inject(FriendWishListStoreService);
    expect(service).toBeTruthy();
  });
});
