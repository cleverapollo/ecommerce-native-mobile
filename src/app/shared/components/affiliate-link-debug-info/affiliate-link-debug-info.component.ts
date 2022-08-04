import { Component, Input, OnInit } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';

@Component({
  selector: 'app-affiliate-link-debug-info',
  templateUrl: './affiliate-link-debug-info.component.html',
  styleUrls: ['./affiliate-link-debug-info.component.scss'],
})
export class AffiliateLinkDebugInfoComponent implements OnInit {

  @Input() wish: WishDto | FriendWish;

  affiliateLink = ''

  constructor(private affiliateLinkService: AffiliateLinkService, private modalController: ModalController) { }

  async ngOnInit() {
    this.affiliateLink = await this.affiliateLinkService.createAffiliateLink(this.wish.productUrl);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
