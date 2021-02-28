import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LogService } from '@core/services/log.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit, OnDestroy {

  wishLists: FriendWishList[];

  private queryParamSubscription: Subscription;

  constructor(
    private navContoller: NavController, 
    private route: ActivatedRoute,
    private router: Router,
    private friendWishListStore: FriendWishListStoreService,
    private logger: LogService
  ) {}

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;

    this.queryParamSubscription = this.route.queryParamMap.subscribe({
      next: queryParams => {
        const forceRefresh = queryParams.get('forceRefresh');
        if (forceRefresh !== null) {
          this.friendWishListStore.loadWishLists(Boolean(forceRefresh)).subscribe({
            next: updatedWishLists => {
              this.wishLists = updatedWishLists;
              this.removeQueryParams();
            },
            error: error => {
              this.logger.error(error);
              this.removeQueryParams();
            }
          })
        }
      }
    });
  }

  private removeQueryParams() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {}});
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
  }

  selectWishList(wishList: FriendWishList) {
    this.navContoller.navigateForward(`secure/friends-home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.friendWishListStore.loadWishLists(true).pipe(first()).subscribe({
      next: wishLists => {
        this.wishLists = wishLists;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

}
