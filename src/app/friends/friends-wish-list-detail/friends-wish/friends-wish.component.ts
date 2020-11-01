import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { WishApiService } from '@core/api/wish-api.service';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-friends-wish',
  templateUrl: './friends-wish.component.html',
  styleUrls: ['./friends-wish.component.scss'],
})
export class FriendsWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Output() onWishPurchased: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

  constructor(
    private browserService: BrowserService,
    private wishApiService: WishApiService
  ) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl
    this.browserService.openInAppBrowser(url); 
  }

  reserve() {
    this.wishApiService.purchase(this.wish.id).subscribe((response: FriendWish) => {
      this.wish = response;
      this.onWishPurchased.emit(response);
    });
  }

}
