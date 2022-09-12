import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { Masonry } from '@shared/masonry';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit, AfterViewChecked {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  data: { wishList: FriendWishList };
  wishList: FriendWishList;
  wishes$: Observable<FriendWish[]> = of([]);

  get date(): string {
    let dateString  = 'noch kein Datum festgelegt';
    if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  trackByWishId: TrackByFunction<FriendWish> = (idx, wish) => wish.id;

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private publicResourceApiService: PublicResourceApiService,
    private datePipe: DatePipe,
    private friendWishListStore: FriendWishListStoreService
  ) { }

  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.wishList = this.data.wishList;
    this.wishes$ = this.friendWishListStore.loadWishes(this.wishList.id);
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-wishlist')
  }

  updateWishList(updatedWish: FriendWish) {
    const wishIndex = this.wishList.wishes
      .findIndex((w: FriendWish) => w.id === updatedWish.id);
    if (wishIndex !== -1) {
      this.wishList.wishes[wishIndex] = updatedWish;
    } else {
      this.refreshData();
    }
  }

  private refreshData() {
    this.publicResourceApiService.getSharedWishList(this.wishList.id)
    .pipe(
      first()
    )
    .subscribe(wishList => {
      this.wishList = wishList;
    })
  }

}
