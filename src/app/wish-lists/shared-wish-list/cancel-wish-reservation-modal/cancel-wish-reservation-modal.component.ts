import { Component, Input, OnInit } from '@angular/core';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';

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
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  cancelWishReservation() {
    this.wishListApiService.cancelWishReservation({ 
      identifier: this.identifier, 
      email: this.email, 
      wishId: this.wish.id 
    }).toPromise().then( wishList => {
      this.wishList = wishList;
      this.reservationCanceled = true;
    }, console.error)
  }

  closeModal() {
    this.modalController.dismiss(this.wishList);
  }

}
