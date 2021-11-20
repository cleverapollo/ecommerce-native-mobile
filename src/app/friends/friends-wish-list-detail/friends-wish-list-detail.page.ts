import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';
import { LogService } from '@core/services/log.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit, OnDestroy {

  wishList: FriendWishList;
  
  private wishListId: string;
  private loadWishListSubscription: Subscription;
  
  constructor(
    private logger: LogService,
    private navController: NavController, 
    private route: ActivatedRoute,
    private friendWishListStore: FriendWishListStoreService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
    })
  }

  ionViewWillEnter() {
    this.friendWishListStore.loadWishList(this.wishListId).pipe(first()).subscribe(wishList => {
      this.wishList = wishList;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-family_friends');
  }

  ngOnDestroy() {
    this.loadWishListSubscription?.unsubscribe();
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
    this.loadWishListSubscription = this.friendWishListStore.loadWishList(this.wishList.id, true).subscribe({
      next: wishList => {
        this.wishList = wishList;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }
}
