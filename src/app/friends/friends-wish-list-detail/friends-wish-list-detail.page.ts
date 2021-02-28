import { Component, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LogService } from '@core/services/log.service';
import { EmailVerificationService } from '@core/services/email-verification.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit {

  wishList: FriendWishList
  
  constructor(
    private navController: NavController, 
    private route: ActivatedRoute,
    private friendWishListStore: FriendWishListStoreService,
    private logger: LogService,
    private emailVerificationService: EmailVerificationService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
  }

  goBack() {
    this.navController.navigateBack('/friends-wish-list-overview');
  }

  updateWish(updatedWish: FriendWish) {
    const index = this.wishList.wishes.findIndex( w => w.id === updatedWish.id );
    if (index !== -1) {
      this.wishList.wishes[index] = updatedWish;
      this.friendWishListStore.updateCachedWishList(this.wishList);
    }
  } 

  forceRefresh(event) {
    this.friendWishListStore.loadWishList(this.wishList.id, true).pipe(first()).subscribe({
      next: wishList => {
        this.wishList = wishList;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
    this.emailVerificationService.updateEmailVerificationStatusIfNeeded();
  }
}
