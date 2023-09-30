import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { ProductList } from '@core/models/product-list.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { APP_URL } from '@env/environment';
import { NavController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { shareLink } from '@shared/helpers/share.helper';
import { Subscription, combineLatest } from 'rxjs';
import { filter, finalize, first, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-overview',
  templateUrl: './product-list-overview.page.html',
  styleUrls: ['./product-list-overview.page.scss'],
})
export class ProductListOverviewPage implements OnInit, OnDestroy {

  account: ContentCreatorAccount | null = null;
  image: Blob | null = null;
  isLoading = false;
  productLists: ProductList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private logger: Logger,
    private userStore: UserProfileStore,
    private productListStore: ProductListStoreService,
    private analyticsService: AnalyticsService,
    private navController: NavController,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription.add(this._setupData());
    this._loadProductLists();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_overview');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectProductList(productList: ProductList) {
    this.navController.navigateForward(`secure/product-lists/product-list/${productList.id}`);
  }

  getClass(listIndex: number) {
    return {
      'product-list-right': listIndex % 2 === 0,
      'product-list-left': listIndex % 2 === 1,
      'product-list-first': listIndex === 0
    }
  }

  async forceRefresh(event: Event): Promise<void> {
    const target = event.target as HTMLIonRefresherElement;
    this.isLoading = true;
    await this.userStore.loadUserProfile(true).toPromise();
    target.complete();
  }

  share(): void {
    shareLink(
      `${APP_URL}/creator/${this.account.userName}`,
      `👉 Folge ${this.account.userName} jetzt auf Wantic`,
      `🌟 Entdecke fesselnden Wunschlisten auf Wantic! 📝 Folge @${this.account.userName} und entdecke inspirierende Ideen und Empfehlungen, die deine Neugier wecken werden! 📚✈️📱!`
    ).catch(error => this.logger.error(error));
  }

  private _setupData(): Subscription {
    const user$ = this.userStore.user$.pipe(filter((user): user is UserProfile => !!user));
    return combineLatest([user$, this.userStore.creatorImage$]).pipe(
      map(result => ({ account: result[0].creatorAccount, image: result[1] }))
    ).subscribe({
      next: data => {
        this.account = data.account;
        this.image = data.image;
        this.isLoading = false;
      },
      error: _ => {
        this.isLoading = false;
      }
    })
  }

  private async _loadProductLists(): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.subscription.add(this.productListStore.getAll(false).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: productLists => {
        this.productLists = productLists;
      }
    }));
  }

}
