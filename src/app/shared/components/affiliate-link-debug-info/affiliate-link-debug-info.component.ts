import { Component, Input, OnInit } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateService } from '@core/services/affiliate.service';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-affiliate-link-debug-info',
  templateUrl: './affiliate-link-debug-info.component.html',
  styleUrls: ['./affiliate-link-debug-info.component.scss'],
})
export class AffiliateLinkDebugInfoComponent implements OnInit {

  @Input() wish: WishDto | FriendWish;

  constructor(private affiliateService: AffiliateService, private modalController: ModalController) { }

  ngOnInit() {}

  get affiliateLink(): string {
    let affiliateLink = '';
    if (this.wish.productUrl) {
      affiliateLink = this.affiliateService.createAffiliateLink(this.wish.productUrl);
    }
    return affiliateLink;
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
