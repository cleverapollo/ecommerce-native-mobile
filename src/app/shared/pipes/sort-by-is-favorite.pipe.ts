import { Pipe, PipeTransform } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

// FIXME: Style 04-13 Do not add filtering and sorting logic to pipes
@Pipe({
  name: 'sortByIsFavorite'
})
export class SortByIsFavoritePipe implements PipeTransform {

  transform(value: WishDto[] | FriendWish[]): WishDto[] | FriendWish[] {
    return value.sort(this.sortWishesByIsFavorite);
  }

  private sortWishesByIsFavorite(wishA: WishDto | FriendWish, wishB:  WishDto | FriendWish): number {
    const bothHasSameValues = (wishA.isFavorite && wishB.isFavorite) || (!wishA.isFavorite && !wishB.isFavorite);
    if (bothHasSameValues) {
      return wishA.name.localeCompare(wishB.name);
    } else if (wishA.isFavorite) {
      return -1;
    } else if (wishB.isFavorite) {
      return 1;
    }
    return 0;
  }

}
