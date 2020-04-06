import { Component, OnInit, Input } from '@angular/core';
import { FriendWish } from 'src/app/friends-wish-list-overview/friends-wish-list-overview.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WishApiService } from 'src/app/shared/services/wish-api.service';

@Component({
  selector: 'app-friends-wish',
  templateUrl: './friends-wish.component.html',
  styleUrls: ['./friends-wish.component.scss'],
})
export class FriendsWishComponent implements OnInit {

  @Input() wish: FriendWish;

  constructor(private inAppBrowser: InAppBrowser, private wishApiService: WishApiService) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl
    const browser = this.inAppBrowser.create(url);
    browser.show();
  }

  reserve() {
    this.wishApiService.purchase(this.wish.id).subscribe((response: FriendWish) => {
      this.wish = response;
    }, e => console.error(e));
  }

}
