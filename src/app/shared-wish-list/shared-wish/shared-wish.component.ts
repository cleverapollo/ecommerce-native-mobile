import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FriendWish } from 'src/app/friends-wish-list-overview/friends-wish-list-overview.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-shared-wish',
  templateUrl: './shared-wish.component.html',
  styleUrls: ['./shared-wish.component.scss'],
})
export class SharedWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Output() onButtonClicked: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

  constructor(private inAppBrowser: InAppBrowser) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl
    const browser = this.inAppBrowser.create(url);
    browser.show();
  }

  reserve() {
    this.onButtonClicked.emit(this.wish);
  }

}
