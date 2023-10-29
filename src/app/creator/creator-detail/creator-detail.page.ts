import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { ProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { CreatorService } from '@core/services/creator.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { Subscription, concatMap } from 'rxjs';

@Component({
  selector: 'app-creator-detail',
  templateUrl: './creator-detail.page.html',
  styleUrls: ['./creator-detail.page.scss'],
})
export class CreatorDetailPage implements OnInit, OnDestroy {

  account: ContentCreatorAccount;
  productLists: ProductList[] = [];

  private subscriptions = new Subscription();

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly creatorService: CreatorService,
    private readonly productListStore: ProductListStoreService,
    private readonly toastService: CoreToastService,
    private readonly logger: Logger,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.creatorService.selectedCreator$.pipe(
      concatMap(creatorAccount => {
        this.account = creatorAccount;
        return this.productListStore.getProductListsForCreator(creatorAccount.userName);
      })
    ).subscribe({
      next: productLists => {
        this.productLists = productLists;
      },
      error: error => {
        this.logger.error(error);
        this.toastService.presentErrorToast('Fehler beim Laden');
      }
    }));
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_detail');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectProductList(productList: ProductList) {
    this.router.navigate(['product-list', productList.id], {
      relativeTo: this.route
    })
  }

}
