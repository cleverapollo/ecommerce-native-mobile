import { Component, Input, OnInit } from '@angular/core';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { LogService } from '@core/services/log.service';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cancel-wish-reservation-modal',
  templateUrl: './cancel-wish-reservation-modal.component.html',
  styleUrls: ['./cancel-wish-reservation-modal.component.scss'],
})
export class CancelWishReservationModalComponent implements OnInit {

  @Input() wishList: FriendWishList;
  @Input() wish: FriendWish
  @Input() identifier: string;
  @Input() email: string;

  reservationCanceled: boolean = false;

  constructor(
    private wishListApiService: WishListApiService, 
    private modalController: ModalController,
    private logger: LogService
  ) { }

  ngOnInit() {}

  cancelWishReservation() {
    this.wishListApiService.toggleWishReservation(this.wishList.id, this.wish.id, this.email).pipe(first()).subscribe({
      next: wishList => {
        this.wishList = wishList;
        this.reservationCanceled = true;
      },
      error: this.logger.error
    })
  }

  closeModal() {
    this.modalController.dismiss(this.wishList);
  }

}
