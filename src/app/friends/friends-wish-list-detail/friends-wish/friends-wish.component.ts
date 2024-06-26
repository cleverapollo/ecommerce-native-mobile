import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishApiService } from '@core/api/wish-api.service';
import { FriendWish } from '@core/models/wish-list.model';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { BrowserService } from '@core/services/browser.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';

@Component({
  selector: 'app-friends-wish',
  templateUrl: './friends-wish.component.html',
  styleUrls: ['./friends-wish.component.scss'],
})
export class FriendsWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Output() wishPurchase: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

  get isDebugInfoVisible(): boolean {
    return environment.backendType === BackendConfigType.beta ||
      environment.backendType === BackendConfigType.dev;
  }

  get cssClassWishReservedState(): string {
    if (this.wish.reservedByFriend) {
      return 'wish-reserved';
    } else if (this.wish.bought) {
      return 'wish-bought';
    }
    return null;
  }

  get imgStyles(): WishImageComponentStyles {
    return {
      img: {
        'min-height': '107px',
        'max-height': '245px'
      }
    }
  }

  private affiliateLink = '';

  constructor(
    private browserService: BrowserService,
    private wishApiService: WishApiService,
    private affiliateService: AffiliateLinkService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.affiliateLink = await this.affiliateService.createAffiliateLink(this.wish.productUrl);
  }

  openProductURL() {
    this.browserService.openSystemBrowser(this.affiliateLink);
  }

  reserve() {
    this.wishApiService.reserveWish(this.wish.id).subscribe((response: FriendWish) => {
      this.wish = response;
      this.wishPurchase.emit(response);
    });
  }

  async showDebugInfo() {
    const modal = await this.modalController.create({
      component: AffiliateLinkDebugInfoComponent,
      componentProps: {
        wish: this.wish
      },
      cssClass: 'wantic-modal',
    });
    await modal.present();
  }

}
