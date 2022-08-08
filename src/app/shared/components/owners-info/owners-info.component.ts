import { Component, Input } from '@angular/core';
import { UserDto, UserWishListDto } from '@core/models/user.model';

@Component({
  selector: 'app-owners-info',
  templateUrl: './owners-info.component.html',
  styleUrls: ['./owners-info.component.scss'],
})
export class OwnersInfoComponent {

  @Input() owners: Array<UserDto | UserWishListDto> = [];
  @Input() showOnlyInitials = false;

  get wishListOwnerCount(): number {
    return this.owners.length;
  }

  cssClass(first: boolean, last: boolean) {
    return {
      standalone: this.wishListOwnerCount === 1,
      first: this.wishListOwnerCount > 1 && first,
      last: this.wishListOwnerCount > 1 && last
    }
  }

  constructor() { }

}
