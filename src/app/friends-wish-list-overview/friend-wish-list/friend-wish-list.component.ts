import { Component, OnInit, Input } from '@angular/core';
import { WishList } from 'src/app/home/wishlist.model';
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

}
