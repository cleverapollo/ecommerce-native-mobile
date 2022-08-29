import { compareAsc } from 'date-fns';
import { FriendWish, WishDto, WishListDto, WishListSelectOptionDto } from './models/wish-list.model';

export function sortWishesByIsFavorite(wishA: FriendWish | WishDto, wishB: FriendWish | WishDto): number {
  return Number(wishB.isFavorite) - Number(wishA.isFavorite);
}

export function sortWishListsByName(wishListA: WishListSelectOptionDto | WishDto, wishListB: WishListSelectOptionDto | WishDto) {
  return wishListA.name.localeCompare(wishListB.name.toString());
}

export function sortWishListsByDate(wishListA: WishListDto, wishListB: WishListDto): number {
  const dateA = wishListA.date;
  const dateB = wishListB.date;

  if (!dateA && !dateB) {
    return sortWishListsByName(wishListA, wishListB);
  }

  if (!dateA || isPast(dateA)) {
    return 1;
  }

  if (!dateB || isPast(dateB)) {
    return -1;
  }

  return compareAsc(dateA, dateB);
}

/**
 * Is the given date in the past? Time is ignored.
 * We can't use date-fs isPast here, because the method also compares the time.
 * @param date the date to check
 * @param today optional - useful in unit test
 * @returns true if the date is in the past
 */
export function isPast(date: Date, today: Date = new Date()): boolean {
  today.setHours(0, 0, 0, 0);
  return date < today;
}