import { Pipe, PipeTransform } from '@angular/core';
import { FriendWishListOwner } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Pipe({
  name: 'ownerNames'
})
export class OwnerNamesPipe implements PipeTransform {

  transform(owners: [FriendWishListOwner]): String {
    return owners.map(o => o.firstName).join(" & ");
  }

}
