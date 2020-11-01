import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-shared-wish',
  templateUrl: './shared-wish.component.html',
  styleUrls: ['./shared-wish.component.scss'],
})
export class SharedWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Output() onButtonClicked: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

  constructor(private browserService: BrowserService) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

  reserve() {
    this.onButtonClicked.emit(this.wish);
  }

}
