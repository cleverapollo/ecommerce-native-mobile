import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDto } from '@core/models/user.model';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LoadingService } from '@core/services/loading.service';
import { LOADING_STRING, NO_DATE_SELECTED } from '@core/ui.constants';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

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

  private subscription: Subscription = new Subscription();
  private wishListId?: string = null;
  private initialized = false;

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private datePipe: DatePipe,
    private store: FriendWishListStoreService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.subscription.add(this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
      this.refreshWishList(this.wishListId, true);
    }));
  }

  ionViewWillEnter() {
    if (this.initialized) {
      this.refreshWishList(this.wishListId);
    }
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-wishlist');

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  updateWishList(updatedWish: FriendWish) {
    const wishIndex = this.wishList.wishes
      .findIndex((w: FriendWish) => w.id === updatedWish.id);
    if (wishIndex !== -1) {
      this.wishList.wishes[wishIndex] = updatedWish;
    } else {
      this.refreshWishList(updatedWish.wishListId);
    }
  }

  private async refreshWishList(wishListId: string, showLoadingSpinner = false) {
    if (!this.wishListId) {
      return;
    }

    if (showLoadingSpinner) {
      await this.loadingService.showLoadingSpinner();
    }

    this.store.loadWishList(wishListId, true).pipe(
      first(),
      finalize(() => {
        this.initialized = true;
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe(wishList => {
      this.wishList = wishList;
      this.wishes = this.wishList.wishes;
    });
  }

}
