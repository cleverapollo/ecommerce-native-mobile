import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { LoadingService } from '@core/services/loading.service';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit, OnDestroy {

  wishLists: Array<WishListDto> = new Array();
  refreshData = false;

  private loadWishListsSubscription: Subscription;

  constructor(
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private affiliateDataStore: AffiliateDataStoreService
  ) { }

  async ngOnInit() {
    const loading = await this.loadingService.createLoadingSpinner();
    await loading.present();
    this.wishListStore.loadWishLists(false).pipe(first()).subscribe( wishLists => {
      this.updateWishLists(wishLists)
      this.loadingService.dismissLoadingSpinner(loading);
    }, () => {
      this.loadingService.dismissLoadingSpinner(loading);
    })
  }

  ngOnDestroy() {
    this.loadWishListsSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.refreshData) {
      this.wishListStore.loadWishLists(false).subscribe( wishLists => {
        this.updateWishLists(wishLists)
      })
    }
    this.initAffiliateDataIfNeeded();
  }

  private initAffiliateDataIfNeeded() {
    if (this.affiliateDataStore.affiliateProgrammes.length === 0) {
      this.affiliateDataStore.loadData();
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('main');
    SplashScreen.hide({
      fadeOutDuration: 500
    });
  }

  ionViewDidLeave() {
    this.refreshData = true;
  }

  selectWishList(wishList: WishListDto) {
    this.navController.navigateForward(`secure/home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.loadWishListsSubscription = this.wishListStore.loadWishLists(true).subscribe({
      next: wishLists => {
        this.updateWishLists(wishLists);
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

  private updateWishLists(wishLists: Array<WishListDto>) {
    this.wishLists = wishLists;
    this.wishLists.sort((wishListA, wishListB) => {
      if (wishListA.date === null && wishListB.date === null) {
        return wishListA.name.localeCompare(wishListB.name);
      }
      return this.getTime(wishListA.date) - this.getTime(wishListB.date);
    })
  }

  private getTime(date?: Date) {
    if (date != null) {
      return !this.dateIsInPast(date) ? new Date(date).getTime() : new Date(3000, 1).getTime();
    }
    return new Date(4000, 1).getTime();
  }

  private dateIsInPast(date: Date): boolean {
    const isoDate = new Date(date);
    const now = new Date();
    now.setHours(0,0,0,0);
    return isoDate < now;
  }

}
