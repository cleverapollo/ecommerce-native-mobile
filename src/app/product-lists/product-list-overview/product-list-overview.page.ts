import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { filter, finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-overview',
  templateUrl: './product-list-overview.page.html',
  styleUrls: ['./product-list-overview.page.scss'],
})
export class ProductListOverviewPage implements OnInit, AfterViewInit, OnDestroy {

  productLists: ProductList[] = [];

  private account: ContentCreatorAccount | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private logger: Logger,
    private userStore: UserProfileStore,
    private productListStore: ProductListStoreService,
    private analyticsService: AnalyticsService,
    private navController: NavController,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this._loadUser();
    this._loadProductLists();
  }

  ngAfterViewInit(): void {
    this.subscription.add(this.productListStore.productLists$.subscribe(productLists => this.productLists = productLists));
  }

  ionViewDidEnter(): void {
    this.analyticsService.setFirebaseScreenName('creator_overview');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectProductList(productList: ProductList): void {
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
    this.userStore.loadUserProfile(true).pipe(first()).subscribe();
    this.productListStore.getAll(true).pipe(first()).subscribe();
    target.complete();
  }

  share(): void {
    shareLink(
      `${APP_URL}/creator/${this.account.userName}`,
      `👉 Folge ${this.account.userName} jetzt auf Wantic`,
      `🌟 Entdecke fesselnden Wunschlisten auf Wantic! 📝 Folge @${this.account.userName} und entdecke inspirierende Ideen und Empfehlungen, die deine Neugier wecken werden! 📚✈️📱!`
    ).catch(error => this.logger.error(error));
  }

  private _loadUser(): void {
    this.subscription.add(this.userStore.user$.pipe(
      filter((user): user is UserProfile => !!user)
    ).subscribe(user => {
      this.account = user.creatorAccount;
    }
    ))
  }

  private async _loadProductLists(): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.getAll().pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe();
  }

}
