import { Component, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from './friends-wish-list-overview.model';
import { Router } from '@angular/router';
import { FriendWishListService } from '../shared/services/friend-wish-list.service';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit {

  testData: FriendWishList = new FriendWishList()

  wishLists: [FriendWishList];

  constructor(private router: Router, private wishListService: FriendWishListService) { 
    let wish = new FriendWish();
    wish.id = 0;
    wish.name = "Otter-Kuscheltier";
    wish.price = "12.99";
    wish.wishListId = 0;
    wish.reservedByFriend = false;
    wish.bought = false;
    wish.imageUrl = "https://images-na.ssl-images-amazon.com/images/I/71InS9P3sIL._AC_SX425_.jpg";
    wish.productUrl = "https://www.amazon.de/Fisher-Price-FXC66-beruhigender-Atembewegungen-Einschlafhilfe/dp/B07N1JP56L/ref=sr_1_12?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1VPLHO0EEH4S6&dchild=1&keywords=otter+kuscheltier&qid=1584643257&sprefix=otter+k%2Caps%2C164&sr=8-12";
    
    this.testData.id = 0;
    this.testData.friendName = "Anna";
    this.testData.date = "2020-03-18";
    this.testData.name = "30. Geburtstag";
    this.testData.wishes = [wish];
    this.wishLists = [this.testData];
  }

  ngOnInit() {}

  selectWishList(wishList: FriendWishList) {
    this.wishListService.updateSelectedWishList(wishList);
    this.router.navigate(['friends-wish-list-detail']);
  }

}
