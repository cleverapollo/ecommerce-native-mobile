import { Component, OnInit } from '@angular/core';
import { SharedWishListDto, FriendWish } from '../friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GiveSharedWishModalComponent } from './give-shared-wish-modal/give-shared-wish-modal.component';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  wishList: SharedWishListDto

  constructor(private route: ActivatedRoute, private modalController: ModalController) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
  }

  openModal(wish: FriendWish) {
    this.modalController.create({
      component: GiveSharedWishModalComponent,
      componentProps: {
        wish: wish
      },
      cssClass: 'wantic-modal'
    }).then( (modal) => {
      modal.present();
    })
  }

}
