import { Component, OnDestroy, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit, OnDestroy {

  wishLists: WishListDto[] = [];

  private subscription?: Subscription;

  constructor(
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private analyticsService: AnalyticsService,
    private affiliateDataStore: AffiliateDataStoreService,
    private loadingService: LoadingService
  ) { }

  async ngOnInit() {
    await this.loadingService.showLoadingSpinner();
    this.wishListStore.loadWishLists().pipe(
      first(),
      finalize(async () => {
        await this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: wishLists => {
        this.wishLists = wishLists;
      }
    })
    this.listenToUpdates();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ionViewWillEnter() {
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

  selectWishList(wishList: WishListDto) {
    this.navController.navigateForward(`secure/home/wish-list/${wishList.id}`);
  }

  async forceRefresh(event: Event) {
    const target = event.target as HTMLIonRefresherElement;
    this.wishListStore.loadWishLists(true).pipe(
      first(),
      finalize(() => {
        target.complete();
      })
    ).subscribe({
      next: wishLists => {
        this.wishLists = wishLists;
      }
    })
  }

  private listenToUpdates() {
    this.subscription = this.wishListStore.wishLists.pipe().subscribe({
      next: wishLists => {
        this.wishLists = wishLists;
      }
    })
  }

}
