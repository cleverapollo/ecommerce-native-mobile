import { Component, OnInit } from '@angular/core';
import { SharedWishListDto, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GiveSharedWishModalComponent } from './give-shared-wish-modal/give-shared-wish-modal.component';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { StorageService } from '@core/services/storage.service';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  wishList: SharedWishListDto

  private STORAGE_KEY = 'SHARED_WISH_LIST_EMAIL';
  private email?: string;

  constructor(
    private route: ActivatedRoute, 
    private storageService: StorageService,
    private modalController: ModalController,
    private browserService: BrowserService,
    private wishListApiService: WishListApiService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.initEmailIfExists();
  }

  private async initEmailIfExists() {
    this.email = await this.storageService.get<string>(this.STORAGE_KEY);
  }

  give(wish: FriendWish) {
    if (this.email && wish.bought && !wish.reservedByFriend) {
      this.togglePurchaseState(wish);
    } else {
      this.openModal(wish);
    }
  }

  private async openModal(wish: FriendWish) {
    const modal = await this.modalController.create({
      component: GiveSharedWishModalComponent,
      componentProps: {
        wish: wish,
        email: this.email
      },
      cssClass: 'wantic-modal',
    });

    modal.onWillDismiss().then((data) => {
      this.wishList = data['data'];
      this.openWishInAppBrowserAfterThreeSeconds(wish);
    })
    return modal.present();
  } 

  private togglePurchaseState(wish: FriendWish) {
    this.wishListApiService.registerAndSatisfyWish({ 
      identifier: this.route.snapshot.queryParams.identifier, 
      email: this.email, 
      wishId: wish.id 
    }).toPromise().then( wishList => {
      this.wishList = wishList;
    }, console.error)
  }

  private openWishInAppBrowserAfterThreeSeconds(wish: FriendWish) {
    setTimeout(() => {
      const url = wish.productUrl
      this.browserService.openInAppBrowser(url);
    }, 3000);
  }

}
