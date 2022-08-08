import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '@core/services/analytics.service';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { FriendWishList } from '@core/models/wish-list.model';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit, OnDestroy {

  wishLists: FriendWishList[] = [];

  private forceRefreshWishLists = false;

  // subscriptions
  private queryParamSubscription: Subscription = null;
  private refreshWishListsSubscription: Subscription = null;
  private forceRefreshWishListsSubscription: Subscription = null;

  constructor(
    private navContoller: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private friendWishListStore: FriendWishListStoreService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.queryParamSubscription = this.route.queryParams.subscribe(queryParams => {
      if (queryParams.forceRefresh) {
        this.forceRefreshWishLists = Boolean(queryParams.forceRefresh);
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {}}); // remove query params
      }
    });
  }

  ionViewWillEnter() {
    this.refreshWishListsSubscription = this.friendWishListStore.loadWishLists(this.forceRefreshWishLists).subscribe(wishLists => {
      this.forceRefreshWishLists = false;
      this.wishLists = wishLists;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('family_friends');
  }

  ngOnDestroy() {
    this.queryParamSubscription?.unsubscribe();
    this.refreshWishListsSubscription?.unsubscribe();
    this.forceRefreshWishListsSubscription?.unsubscribe();
  }

  selectWishList(wishList: FriendWishList) {
    this.navContoller.navigateForward(`${getTaBarPath(TabBarRoute.FRIENDS_HOME, true)}/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.forceRefreshWishListsSubscription = this.friendWishListStore.loadWishLists(true).subscribe({
      next: wishLists => {
        this.wishLists = wishLists;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

}
