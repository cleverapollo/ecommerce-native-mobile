import { WishListDto, WishListSelectOptionDto } from './models/wish-list.model';
import { WishListTestData } from './test/wish-list-data';
import { sortWishesByIsFavorite, sortWishListsByDate, isPast, sortWishListsByName } from './wish-list.utils';
import { v4 as uuidv4 } from 'uuid';

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

    describe('sortWishListsByName', () => {

        const wedding = createWishList('Xaver & Melly Wedding');
        const birthday = createWishList('Alan Birthday');
        const birth = createWishList('Anton Birth');
        const myWishList = createWishList('My first wish list');

        it('sorts wish list asc', () => {
            const wishLists = [
                wedding,
                birthday,
                birth,
                myWishList
            ]
            const sorted = wishLists.sort(sortWishListsByName);
            expect(sorted).toEqual([
                birthday,
                birth,
                myWishList,
                wedding
            ])
        })

        it('sorts wish list select options asc', () => {
            const wishLists = [
                wedding,
                birthday,
                birth,
                myWishList
            ].map(w => WishListSelectOptionDto.forWishList(w));
            const sorted = wishLists.sort(sortWishListsByName);
            expect(sorted).toEqual([
                birthday,
                birth,
                myWishList,
                wedding
            ].map(w => WishListSelectOptionDto.forWishList(w)))
        })

        function createWishList(name: string): WishListDto {
            return {
                id: uuidv4(),
                name: name,
                date: null,
                wishes: [],
                showReservedWishes: false,
                creatorEmail: 'max.mustermann@web.de',
                owners: []
            }
        }

    })

    describe('isPast', () => {

        it('returns true if date is in past', () => {
            const today = new Date('2022-08-22T10:33:00');
            const tomorrow = new Date(today);
            const yesterday = new Date(today);

            tomorrow.setDate(tomorrow.getDate() + 1);
            yesterday.setDate(yesterday.getDate() - 1);

            expect(isPast(today, today)).toBeFalsy();
            expect(isPast(tomorrow, today)).toBeFalsy();
            expect(isPast(yesterday, today)).toBeTruthy();
        })

        it('returns false if the date is the same but time is in the past', () => {
            const now = new Date('2022-08-22T10:33:00');
            const before10Min = new Date('2022-08-22T10:23:00');
            const after10Min = new Date('2022-08-22T10:43:00');

            expect(isPast(now, now)).toBeFalsy();
            expect(isPast(before10Min, now)).toBeFalsy();
            expect(isPast(after10Min, now)).toBeFalsy();
        })
    })

    describe('sortWishListsByDate', () => {
        const today = new Date('2022-08-22T10:33:00');
        const tomorrow = new Date(today);
        const yesterday = new Date(today);

        tomorrow.setDate(tomorrow.getDate() + 1);
        yesterday.setDate(yesterday.getDate() - 1);

        const wishListFuture = createWishList('future', tomorrow);
        const wishListPast = createWishList('past', yesterday);
        const wishListNoDate = createWishList('noDate');
        const wishListToday = createWishList('today', today);

        const wishLists = [
            wishListFuture,
            wishListPast,
            wishListNoDate,
            wishListToday
        ]

        it('sorts wish lists by date', () => {
            const sorted = wishLists.sort((a, b) => {
                return sortWishListsByDate(a,b,today)
            });
            expect(sorted).toEqual([
                wishListToday,
                wishListFuture,
                wishListPast,
                wishListNoDate,
            ]);
        })

        function createWishList(name: string, date?: Date): WishListDto {
            return {
                id: uuidv4(),
                name: name,
                date: date,
                wishes: [],
                showReservedWishes: false,
                creatorEmail: 'max.mustermann@web.de',
                owners: []
            }
        }

    })

});