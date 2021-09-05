import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { BrowserService } from '@core/services/browser.service';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto
  wish: WishDto

  get wishListOwnerCount(): number {
    return this.wishList?.owners?.length || 0;
  }

  cssClass(first: boolean, last: boolean) {
    return {
      'standalone': this.wishListOwnerCount == 1,
      'first': this.wishListOwnerCount > 1 && first,
      'last': this.wishListOwnerCount > 1 && last
    }
  }

  constructor(
    private browserService: BrowserService,
    public alertService: AlertService,
    private navController: NavController,
    private route: ActivatedRoute,
    private wishListStore: WishListStoreService,
    private analyticsService: AnalyticsService
    ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.wish = this.route.snapshot.data.wish;
  }

  ionViewWillEnter() {
    this.loadWish();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-wish');
  }

  ngOnDestroy() {
  }

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

  goBack() {
    this.navController.back();
  }

  forceRefresh(event) {
    this.wishListStore.loadWish(this.wish.id, true).pipe(first()).subscribe({
      next: wish => {
        this.wish = wish;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

  private async loadWish() {
    const wish = await this.wishListStore.loadWish(this.wish.id).toPromise();
    this.wish = wish;
  }

}
