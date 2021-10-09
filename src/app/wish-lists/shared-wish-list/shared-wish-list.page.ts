import { Component, OnInit } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LogService } from '@core/services/log.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-shared-wish-list',
  templateUrl: './shared-wish-list.page.html',
  styleUrls: ['./shared-wish-list.page.scss'],
})
export class SharedWishListPage implements OnInit {

  data: { wishList: FriendWishList };
  wishList: FriendWishList;
  
  constructor(
    private route: ActivatedRoute, 
    private publicResourceApiService: PublicResourceApiService,
    private logger: LogService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.data = this.route.snapshot.data.data;
    this.wishList = this.data.wishList;
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-wishlist')
  }

  toggleWishReservation(wish: FriendWish) {
    this.publicResourceApiService.toggleWishReservation(this.wishList.id, wish.id).pipe(first()).subscribe({
      next: wishList => {
        this.wishList = wishList;
      },
      error: this.logger.error
    });
  }

}
