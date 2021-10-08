import { Component, Input, OnInit } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateDouglasService } from '@core/services/affiliate/affiliate-douglas.service';
import { AffiliateDefaultService } from '@core/services/affiliate/affiliate-default.service';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-affiliate-link-debug-info',
  templateUrl: './affiliate-link-debug-info.component.html',
  styleUrls: ['./affiliate-link-debug-info.component.scss'],
})
export class AffiliateLinkDebugInfoComponent implements OnInit {

  @Input() wish: WishDto | FriendWish;

  affiliateLink: string = '';

  constructor(private affiliateService: AffiliateDefaultService, private modalController: ModalController, private affiliateDouglasService: AffiliateDouglasService) { }

  ngOnInit() {
    if (this.wish.productUrl.includes('douglas.de')) { 
      this.affiliateDouglasService.createAffiliateLink(this.wish.productUrl).then(affiliateLink => {
        this.affiliateLink = affiliateLink;
      })
    } else {
      this.affiliateLink = this.initAffiliateLink();
    }
  }

  initAffiliateLink(): string {
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
