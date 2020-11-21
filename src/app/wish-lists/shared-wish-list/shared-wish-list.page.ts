import { Component, ComponentRef, OnInit } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ReserveWishModalComponent } from './reserve-wish-modal/reserve-wish-modal.component';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { BrowserService } from '@core/services/browser.service';
import { CancelWishReservationModalComponent } from './cancel-wish-reservation-modal/cancel-wish-reservation-modal.component';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  wishList: FriendWishList;
  
  get readonly(): boolean {
    if (this.inviterEmail && this.email) {
      return this.email === this.inviterEmail;
    }
    return false;
  }

  get inviterEmail(): string {
    const idComponents = this.identifier?.split('_') ?? [];
    if (idComponents.length >= 2) {
      const inviterEmail = idComponents[1];
      return inviterEmail;
    }
    return null
  }
  
  private email?: string;

  private get identifier(): string {
    return this.route.snapshot.queryParams.identifier;
  }

  constructor(
    private route: ActivatedRoute, 
    private storageService: StorageService,
    private modalController: ModalController,
    private browserService: BrowserService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.initEmailIfExists();
  }

  private async initEmailIfExists() {
    const idComponents = this.identifier?.split('_') ?? [];
    if (idComponents.length >= 3) {
      this.email = idComponents[2];
    } else {
      this.email = await this.storageService.get<string>(StorageKeys.SHARED_WISH_LIST_EMAIL);
    }
  }

  toggleWishReservation(wish: FriendWish) {
    const canCancelReservation = this.email && wish.bought && !wish.reservedByFriend;
    if (canCancelReservation) {
      this.openCancelReservationModal(wish);
    } else {
      this.openReserveWishModal(wish);
    }
  }

  private async openReserveWishModal(wish: FriendWish) {
    const modal = await this.createModal(ReserveWishModalComponent, wish, (data: any) => {
      this.wishList = data['data'];
      // this.openWishInAppBrowserAfterThreeSeconds(wish);
    });
    modal.present();
  } 

  private async openCancelReservationModal(wish: FriendWish) {
    const modal = await this.createModal(CancelWishReservationModalComponent, wish, (data: any) => {
      this.wishList = data['data'];
    });
    modal.present();
  }

  private async createModal(component, wish: FriendWish, onWillDismiss: (data: any) => void) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: {
        wish: wish,
        wishList: this.wishList,
        identifier: this.identifier,
        email: this.email
      },
      cssClass: 'wantic-modal',
    });
    modal.onWillDismiss().then(onWillDismiss);
    return modal;
  }

  private openWishInAppBrowserAfterThreeSeconds(wish: FriendWish) {
    setTimeout(() => {
      const url = wish.productUrl
      this.browserService.openInAppBrowser(url);
    }, 3000);
  }

}
