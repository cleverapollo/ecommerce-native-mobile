import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FriendWishList, FriendWish } from '@core/models/wish-list.model';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  data: { wishList: FriendWishList };
  wishList: FriendWishList;

  get date(): string {
    let dateString  = 'noch kein Datum festgelegt';
    if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private publicResourceApiService: PublicResourceApiService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.wishList = this.data.wishList;
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
    this.publicResourceApiService.getSharedWishList(this.wishList.id).pipe(first()).subscribe(wishList => {
      this.wishList = wishList;
    })
  }

}
