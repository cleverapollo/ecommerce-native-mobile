import { TestBed } from '@angular/core/testing';

import { FriendWishListStoreService } from './friend-wish-list-store.service';

describe('FriendWishListStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FriendWishListStoreService = TestBed.get(FriendWishListStoreService);
    expect(service).toBeTruthy();
  });
});
