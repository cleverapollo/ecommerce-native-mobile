import { TestBed, async, inject } from '@angular/core/testing';

import { SharedWishListAccessGuard } from './shared-wish-list-access.guard';

describe('SharedWishListAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedWishListAccessGuard]
    });
  });

  it('should ...', inject([SharedWishListAccessGuard], (guard: SharedWishListAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
