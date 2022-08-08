import { FriendWish, WishDto } from './models/wish-list.model';

export function sortWishesByIsFavorite(wishA: FriendWish | WishDto, wishB: FriendWish | WishDto): number {
    return Number(wishB.isFavorite) - Number(wishA.isFavorite);
  }