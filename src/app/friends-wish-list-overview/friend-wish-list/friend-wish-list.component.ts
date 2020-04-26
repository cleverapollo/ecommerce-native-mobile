import { Component, OnInit, Input } from '@angular/core';
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

  get ownerProfileImageUrls(): String[] {
    const imagesUrls = this.wishList.owners
        .filter(o => o.profileImageUrl !== null)
        .map(o => o.profileImageUrl);
    return imagesUrls;
  }

}
