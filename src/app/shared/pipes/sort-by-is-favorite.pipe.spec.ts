import { WishDto } from '@core/models/wish-list.model';
import { WishListTestData } from '@core/test/wish-list-data';
import { SortByIsFavoritePipe } from './sort-by-is-favorite.pipe';

describe('SortByIsFavoritePipe', () => {

  const pipe = new SortByIsFavoritePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should not crash if wishes are empty', () => {
    expect(pipe.transform([])).toEqual([]);
  })

  it('sorts wishes by isFavorite property', () => {
    const wishes = [
      WishListTestData.wishBoschWasher,
      WishListTestData.dogBowl,
      WishListTestData.towels,
      WishListTestData.bvbShirt
    ]
    expect(pipe.transform(wishes)).toEqual([
      WishListTestData.wishBoschWasher,
      WishListTestData.bvbShirt,
      WishListTestData.dogBowl,
      WishListTestData.towels,
    ])
  });

  it('sorts shared wishes by isFavorite property', () => {
    const wishes = [
      WishListTestData.sharedWishBoschWasher,
      WishListTestData.dogBowlSharedWish,
      WishListTestData.towelsSharedWish,
      WishListTestData.bvbShirtSharedWish
    ]
    expect(pipe.transform(wishes)).toEqual([
      WishListTestData.sharedWishBoschWasher,
      WishListTestData.bvbShirtSharedWish,
      WishListTestData.dogBowlSharedWish,
      WishListTestData.towelsSharedWish,
    ])
  });

});
