import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendWishList } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LoadingService } from '@core/services/loading.service';
import { finalize, first } from 'rxjs/operators';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit {

  wishLists: FriendWishList[] = [];

  private isInitialized = false;

  constructor(
    private router: Router,
    private friendWishListStore: FriendWishListStoreService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadWishLists(true);
  }

  private async loadWishLists(showLoadingSpinner = false) {
    if (showLoadingSpinner) {
      await this.loadingService.showLoadingSpinner();
    }

    this.friendWishListStore.loadWishLists(true).pipe(
      first(),
      finalize(() => {
        this.isInitialized = true;
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe(wishLists => {
      this.wishLists = wishLists;
    });
  }

  ionViewWillEnter() {
    if (this.isInitialized) {
      this.loadWishLists();
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('family_friends');
  }

  selectWishList(wishList: FriendWishList) {
    this.router.navigate([`${getTaBarPath(TabBarRoute.FRIENDS_HOME, true)}/wish-list`, wishList.id], {
      state: {
        wishList: wishList
      }
    });
  }

  forceRefresh(event) {
    this.friendWishListStore.loadWishLists(true)
      .pipe(
        first(),
        finalize(() => {
          event.target.complete();
        })
      )
      .subscribe({
        next: wishLists => {
          this.wishLists = wishLists;
        }
      });
  }

}
