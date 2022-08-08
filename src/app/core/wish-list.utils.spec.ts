import { WishListTestData } from './test/wish-list-data';
import { sortWishesByIsFavorite } from './wish-list.utils';

describe('Wish list utils', () => {

    describe('sortWishesByIsFavorite', () => {

        it('sorts wish lists by is Favorite', () => {
            const wishes = [
                WishListTestData.dogBowl,
                WishListTestData.wishBoschWasher,
                WishListTestData.bvbShirt,
                WishListTestData.towels
            ];
            expect(wishes.sort(sortWishesByIsFavorite)).toEqual([
                WishListTestData.wishBoschWasher,
                WishListTestData.bvbShirt,
                WishListTestData.dogBowl,
                WishListTestData.towels
            ])
        });

        it('sorts friend wish lists by is Favorite', () => {
            const wishes = [
                WishListTestData.dogBowlSharedWish,
                WishListTestData.sharedWishBoschWasher,
                WishListTestData.bvbShirtSharedWish,
                WishListTestData.towelsSharedWish
            ];
            expect(wishes.sort(sortWishesByIsFavorite)).toEqual([
                WishListTestData.sharedWishBoschWasher,
                WishListTestData.bvbShirtSharedWish,
                WishListTestData.dogBowlSharedWish,
                WishListTestData.towelsSharedWish
            ])
        });

    });

});