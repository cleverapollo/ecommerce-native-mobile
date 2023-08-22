import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-shared',
  templateUrl: './product-list-shared.page.html',
  styleUrls: ['./product-list-shared.page.scss'],
})
export class ProductListSharedPage implements OnInit, OnDestroy {

  productList: SharedProductList;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private productListStore: ProductListStoreService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.subscription.add(this.route.params.subscribe(params => {
      const userName = params.get('userName');
      const listName = params.get('listName');
      if (userName && listName) {
        this._loadProductList(userName, listName);
      }
    }));
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-productlist')
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private async _loadProductList(userName: string, listName: string): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.getSharedListByName(userName, listName).pipe(
      first(),
      finalize(() => this.loadingService.stopLoadingSpinner())
    ).subscribe({
      next: productList => {
        this.productList = productList;
      }
    });
  }

}
