import { Component, OnInit } from '@angular/core';
import { FriendWishList } from './friends-wish-list-overview.model';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit {

  testData: FriendWishList = new FriendWishList()

  wishLists: [FriendWishList];

  constructor() { 
    this.testData.id = 0;
    this.testData.friendName = "Anna";
    this.testData.date = "2020-03-18";
    this.testData.name = "30. Geburtstag";
    this.testData.wishes = [];
    this.wishLists = [this.testData];
  }

  ngOnInit() {}

}
