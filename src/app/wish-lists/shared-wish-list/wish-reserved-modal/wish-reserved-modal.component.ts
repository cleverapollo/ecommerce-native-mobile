import { Component, Input, OnInit } from '@angular/core';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wish-reserved-modal',
  templateUrl: './wish-reserved-modal.component.html',
  styleUrls: ['./wish-reserved-modal.component.scss'],
})
export class WishReservedModalComponent implements OnInit {

  @Input() wishList: FriendWishList;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismissModal(wishList?: FriendWishList) {
    this.modalController.dismiss(wishList);
  }

  closeModal() {
    this.dismissModal(this.wishList);
  }

}
