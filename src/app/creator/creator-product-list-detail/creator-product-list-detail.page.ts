import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, SharedProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creator-product-list-detail',
  templateUrl: './creator-product-list-detail.page.html',
  styleUrls: ['./creator-product-list-detail.page.scss'],
})
export class CreatorProductListDetailPage implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  productList: SharedProductList;
  errorMessage: string | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private productListStore: ProductListStoreService,
    private loadingService: LoadingService
  ) { }

  get creatorName(): string {
    const userName = this.productList?.creator.userName;
    return userName ? `@${userName}` : 'Lädt';
  }

  get listName(): string {
    return this.productList?.name || 'Lädt';
  }

  get products(): Product[] {
    return this.productList?.products || [];
  }

  trackById: TrackByFunction<Product> = (idx, product) => product.id;

  ngOnInit() {
    this.subscription.add(this.route.paramMap.subscribe(paramMap => {
      const userName = paramMap.get('userName');
      const listId = paramMap.get('listId');
      if (userName && listId) {
        this._loadProductList(userName, listId);
      }
    }));
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('shared-productlist')
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addProduct(product: Product) {
    this.router.navigate(['wish-create'], {
      relativeTo: this.route,
      state: {
        searchResult: {
          asin: product.asin,
          name: product.name,
          price: product.price,
          productUrl: product.url,
          imageUrl: product.imageUrl
        }
      }
    })
  }

  private async _loadProductList(userName: string, listId: string): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.productList = await this.productListStore.getProductList(userName, listId);
    await this.loadingService.stopLoadingSpinner();
  }

}
