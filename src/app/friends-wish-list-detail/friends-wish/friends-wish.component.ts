import { Component, OnInit, Input } from '@angular/core';
import { FriendWish } from 'src/app/friends-wish-list-overview/friends-wish-list-overview.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-friends-wish',
  templateUrl: './friends-wish.component.html',
  styleUrls: ['./friends-wish.component.scss'],
})
export class FriendsWishComponent implements OnInit {

  @Input() wish: FriendWish;

  constructor(private inAppBrowser: InAppBrowser) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl
    const browser = this.inAppBrowser.create(url);
    browser.show();
  }

  reserve(reserve: Boolean) {
    this.wish.bought = reserve;
  }

}
