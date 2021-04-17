import { Component, OnInit } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ReserveWishModalComponent } from './reserve-wish-modal/reserve-wish-modal.component';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { CancelWishReservationModalComponent } from './cancel-wish-reservation-modal/cancel-wish-reservation-modal.component';
import { QueryEmailModalComponent } from './query-email-modal/query-email-modal.component';
import { first } from 'rxjs/operators';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { WishReservedModalComponent } from './wish-reserved-modal/wish-reserved-modal.component';

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
    private storageService: StorageService,
    private modalController: ModalController,
    private publicResourceApiService: PublicResourceApiService,
    private loadingService: LoadingService,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.wishList = this.data.wishList;
    this.getEmail();
    this.openQueryEmailModal();
  }

  private async getEmail() {
    if (this.data.email) {
      this.email = this.data.email;
    } else {
      this.email = await this.storageService.get<string>(StorageKeys.SHARED_WISH_LIST_EMAIL, true);
    }
  }

  async toggleWishReservation(wish: FriendWish) {
    const canCancelReservation = this.email && wish.bought && !wish.reservedByFriend;
    if (canCancelReservation) {
      this.openCancelReservationModal(wish);
    } else {
      this.openReserveWishModal(wish);
    }
  }

  private async openQueryEmailModal() {
    const modal = await this.modalController.create({
      component: QueryEmailModalComponent,
      cssClass: 'query-email-modal',
      componentProps: {
        cachedEmail: this.email
      },
    });
    modal.onWillDismiss().then((data) => {
      if (data && data['data']) {
        const email = data['data'];
        const identifier = `${this.wishList.id}_${email}`;
        this.email = email;
        this.upateEnteredEmail(email);
        this.loadSharedWishList(identifier);
      }
    });
    modal.present();
  }

  private async upateEnteredEmail(email: string) {
    return await this.storageService.set(StorageKeys.SHARED_WISH_LIST_EMAIL, email, true);
  }

  private async loadSharedWishList(identifier: string) {
    const loadingSpinner = await this.loadingService.createLoadingSpinner();
    this.publicResourceApiService.getSharedWishList(identifier).pipe((first())).subscribe({
      next: wishList => {
        this.wishList = wishList;
        this.loadingService.dismissLoadingSpinner(loadingSpinner);
      },
      error: errorResponse => {
        this.logger.error(errorResponse);
        this.loadingService.dismissLoadingSpinner(loadingSpinner);
      }
    });
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

  private async openCancelReservationModal(wish: FriendWish) {
    const modal = await this.createModal(CancelWishReservationModalComponent, wish, 'cancel-wish-reservation-modal', (data: any) => {
      if (data && data['data']) {
        this.wishList = data['data'];
      }
    });
    modal.present();
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
