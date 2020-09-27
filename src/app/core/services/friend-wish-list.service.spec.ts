import { TestBed } from '@angular/core/testing';

import { FriendWishListService } from './friend-wish-list.service';

describe('FriendWishListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FriendWishListService = TestBed.get(FriendWishListService);
    expect(service).toBeTruthy();
  });
});
