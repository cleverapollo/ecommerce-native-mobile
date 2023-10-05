import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, SharedProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-shared',
  templateUrl: './product-list-shared.page.html',
  styleUrls: ['./product-list-shared.page.scss'],
})
export class ProductListSharedPage implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  productList: SharedProductList;
  errorMessage: string | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
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

  get numberOfProducts(): string {
    const number = this.products.length;
    return number !== 1 ? `${number} Produkte` : '1 Produkt';
  }

  get products(): Product[] {
    return this.productList?.products || [];
  }

  trackById: TrackByFunction<Product> = (idx, product) => product.id;

  ngOnInit() {
    this.subscription.add(this.route.paramMap.subscribe(paramMap => {
      const userName = paramMap.get('userName');
      const listName = paramMap.get('listName');
      if (userName && listName) {
        this._loadProductList(userName, listName);
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

  private async _loadProductList(userName: string, listName: string): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.getSharedListByName(userName, listName).pipe(
      first(),
      finalize(() => this.loadingService.stopLoadingSpinner())
    ).subscribe({
      next: productList => {
        this.productList = productList;
      },
      error: () => {
        this.errorMessage = 'Die Liste konnte nicht geladen werden.'
      },
    });
  }

}
