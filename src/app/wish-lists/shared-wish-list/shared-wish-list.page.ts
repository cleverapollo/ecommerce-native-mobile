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
  }

  private async getEmail() {
    if (this.data.email) {
      this.email = this.data.email;
    } else {
      const savedEmail = await this.storageService.get<string>(StorageKeys.SHARED_WISH_LIST_EMAIL, true);
      this.email = savedEmail;
    }

    if (this.email === null) {
      this.openQueryEmailModal();
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
      cssClass: 'wantic-modal wantic-modal-small',
    });
    modal.onWillDismiss().then((data) => {
      if (data && data['data']) {
        const email = data['data'];
        const identifier = `${this.wishList.id}_${email}`;
        this.email = email;
        this.loadingService.showLoadingSpinner();
        this.publicResourceApiService.getSharedWishList(identifier).pipe((first())).subscribe({
          next: wishList => {
            this.wishList = wishList;
            this.loadingService.dismissLoadingSpinner();
          },
          error: errorResponse => {
            this.logger.error(errorResponse);
            this.loadingService.dismissLoadingSpinner();
          }
        })
      }
    });
    modal.present();
  }

  private async openReserveWishModal(wish: FriendWish) {
    const modal = await this.createModal(ReserveWishModalComponent, wish, 'wantic-modal', (data: any) => {
      if (data && data['data']) {
        this.wishList = data['data'];
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
