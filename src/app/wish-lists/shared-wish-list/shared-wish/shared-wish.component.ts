import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { BrowserService } from '@core/services/browser.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';

@Component({
  selector: 'app-shared-wish',
  templateUrl: './shared-wish.component.html',
  styleUrls: ['./shared-wish.component.scss'],
})
export class SharedWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Input() readonly: boolean = false;
  @Output() onButtonClicked: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

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

  constructor(private browserService: BrowserService, private modalController: ModalController) { }

  ngOnInit() {}

  openProductURL() {
    const url = this.wish.productUrl; // affiliate link is created by backend service
    this.browserService.openInAppBrowser(url);
  }

  reserve() {
    this.onButtonClicked.emit(this.wish);
  }

  imgOnErrorHandler(event) {
    event.target.src = 'assets/images/wish-list-placeholder.svg';
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
