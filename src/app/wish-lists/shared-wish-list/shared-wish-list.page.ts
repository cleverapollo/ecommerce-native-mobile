import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '@core/models/user.model';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LoadingService } from '@core/services/loading.service';
import { LOADING_STRING, NO_DATE_SELECTED } from '@core/ui.constants';
import { findSharedWishList, iife, isAppPath } from '@shared/helpers/common.helper';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  wishList: FriendWishList = null;
  wishes: FriendWish[] = [];

  get date(): string {
    let dateString = NO_DATE_SELECTED;
    if (!this.wishList) {
      dateString = LOADING_STRING;
    } else if (this.wishList?.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  get owners(): UserDto[] {
    return this.wishList?.owners || [];
  }

  get name(): string {
    return this.wishList?.name || LOADING_STRING;
  }

  trackByWishId: TrackByFunction<FriendWish> = (idx, wish) => wish.id;

  private subscriptions: Subscription = new Subscription();
  private wishListId?: string = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private datePipe: DatePipe,
    private store: FriendWishListStoreService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
      iife(this._initWishList(this.wishListId));
      this._subscribeForChanges();
    }));
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewDidEnter(): void {
    this.analyticsService.setFirebaseScreenName('shared-wishlist');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateWishList(updatedWish: FriendWish): void {
    isAppPath(this.router.url) ?
      this.store.updateSharedWish(updatedWish) :
      this.store.updatePublicSharedWish(updatedWish);
  }

  private async _initWishList(wishListId: string): Promise<void> {
    if (!this.wishListId) {
      return;
    }
    await this.loadingService.showLoadingSpinner();
    try {
      const wishList = isAppPath(this.router.url) ?
        await this.store.loadSharedWishList(wishListId, true) :
        await this.store.loadPublicSharedWishList(wishListId, true);
      this.wishList = wishList;
      this.wishes = this.wishList?.wishes;
      await this.loadingService.stopLoadingSpinner();
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
    }
  }

  private _subscribeForChanges(): void {
    if (isAppPath(this.router.url)) {
      this.subscriptions.add(this.store.sharedWishLists$.subscribe(
        wishLists => {
          this.wishList = findSharedWishList(this.wishListId, wishLists);
          this.wishes = this.wishList?.wishes;
        }
      ));
    } else {
      this.subscriptions.add(this.store.publicSharedWishLists$.subscribe(
        wishLists => {
          this.wishList = findSharedWishList(this.wishListId, wishLists);
          this.wishes = this.wishList?.wishes;
        }
      ));
    }
  }

}
