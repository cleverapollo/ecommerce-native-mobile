import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendWishList } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LoadingService } from '@core/services/loading.service';
import { iife } from '@shared/helpers/common.helper';
import { Subscription } from 'rxjs';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit, OnDestroy {

  wishLists: FriendWishList[] = [];

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private store: FriendWishListStoreService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    iife(this._initWishLists());
    this.subscriptions.add(this.store.sharedWishLists$.subscribe(wishLists => {
      this.wishLists = wishLists;
    }));
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('family_friends');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectWishList(wishList: FriendWishList) {
    this.router.navigate([`${getTaBarPath(TabBarRoute.FRIENDS_HOME, true)}/wish-list`, wishList.id], {
      state: {
        wishList: wishList
      }
    });
  }

  async forceRefresh(event): Promise<void> {
    try {
      await this.store.loadSharedWishLists(true);
      event.target.complete();
    } catch (error) {
      event.target.complete();
    }
  }

  private async _initWishLists(): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    try {
      this.wishLists = await this.store.loadSharedWishLists(true);
      await this.loadingService.stopLoadingSpinner();
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
    }
  }

}
