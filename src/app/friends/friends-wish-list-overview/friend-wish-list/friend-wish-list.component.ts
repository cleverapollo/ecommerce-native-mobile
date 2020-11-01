import { Component, OnInit, Input } from '@angular/core';
import { ProfileImageDto } from '@core/models/user.model';
import { FriendWishList } from '../friends-wish-list-overview.model';

@Component({
  selector: 'app-friend-wish-list',
  templateUrl: './friend-wish-list.component.html',
  styleUrls: ['./friend-wish-list.component.scss'],
})
export class FriendWishListComponent implements OnInit {

  @Input() wishList: FriendWishList;

  constructor() { }

  ngOnInit() {}

  get ownerProfileImageInfos(): ProfileImageDto[] {
    const imagesUrls = this.wishList.owners
        .filter(o => o.profileImageInfo !== null)
        .map(o => o.profileImageInfo);
    return imagesUrls;
  }

}
