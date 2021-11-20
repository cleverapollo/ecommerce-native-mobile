import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LogService } from '@core/services/log.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit, OnDestroy {

  wishLists: FriendWishList[] = [];
  
  private forceRefreshWishLists = false;
  private queryParamSubscription: Subscription;
  private loadWishListsSubscription: Subscription;

  constructor(
    private navContoller: NavController, 
    private route: ActivatedRoute,
    private router: Router,
    private friendWishListStore: FriendWishListStoreService,
    private logger: LogService,
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
    this.friendWishListStore.loadWishLists(this.forceRefreshWishLists).pipe(first()).subscribe(wishLists => {
      this.forceRefreshWishLists = false;
      this.wishLists = wishLists;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('family_friends');
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
    this.loadWishListsSubscription?.unsubscribe();
  }

  selectWishList(wishList: FriendWishList) {
    this.navContoller.navigateForward(`secure/friends-home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.loadWishListsSubscription = this.friendWishListStore.loadWishLists(true).subscribe({
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
