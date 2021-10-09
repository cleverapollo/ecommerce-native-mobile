import { Component, OnInit } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ReserveWishModalComponent } from './reserve-wish-modal/reserve-wish-modal.component';
import { first } from 'rxjs/operators';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { WishReservedModalComponent } from './wish-reserved-modal/wish-reserved-modal.component';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  data: { wishList: FriendWishList, email?: string };
  wishList: FriendWishList;
  email?: string;
  
  private get identifier(): string {
    return this.route.snapshot.queryParams.identifier;
  }

  constructor(
    private route: ActivatedRoute, 
    private modalController: ModalController,
    private publicResourceApiService: PublicResourceApiService,
    private loadingService: LoadingService,
    private logger: LogService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.wishList = this.data.wishList;
    this.email = this.data.email;
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-wishlist')
  }

  async toggleWishReservation(wish: FriendWish) {
    const canCancelReservation = this.email && wish.bought && !wish.reservedByFriend;
    if (canCancelReservation) {
      this.cancelWishReservation(wish);
    } else {
      this.openReserveWishModal(wish);
    }
  }

  private async openReserveWishModal(wish: FriendWish) {
    const modal = await this.createModal(ReserveWishModalComponent, wish, 'reserve-wish-modal', (data: any) => {
      if (data && data['data']) {
        this.wishList = data['data'];
        this.createModal(WishReservedModalComponent, wish, 'wish-reserved-modal', (data: any) => {
          if (data && data['data']) { 
            window.open(wish.productUrl);
          }
        }).then(modal => {
          modal.present();
        })
      }
    });
    modal.present();
  } 

  private cancelWishReservation(wish: FriendWish) {
    this.publicResourceApiService.toggleWishReservation(this.wishList.id, wish.id, this.email).pipe(first()).subscribe({
      next: wishList => {
        this.wishList = wishList;
      },
      error: this.logger.error
    })
  }

  private async createModal(component, wish: FriendWish, cssClass: string, onWillDismiss: (data: any) => void) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: {
        wish: wish,
        wishList: this.wishList,
        identifier: this.identifier,
        email: this.email
      },
      cssClass: cssClass,
    });
    modal.onWillDismiss().then(onWillDismiss);
    return modal;
  }

}
