import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { APP_URL } from '@env/environment';
import { RefresherCustomEvent } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { shareLink } from '@shared/helpers/share.helper';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-detail',
  templateUrl: './product-list-detail.page.html',
  styleUrls: ['./product-list-detail.page.scss'],
})
export class ProductListDetailPage implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  productList: ProductList = {
    id: '',
    name: 'Lädt ...',
    products: []
  }

  private subscription: Subscription;

  constructor(
    private analyticsService: AnalyticsService,
    private userStore: UserProfileStore,
    private logger: Logger,
    private productListStore: ProductListStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get numberOfProducts(): string {
    const number = this.products.length;
    return number !== 1 ? `${number} Produkte` : '1 Produkt';
  }

  get products(): Product[] {
    return this.productList?.products || [];
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const productListId = params['productListId'];
      if (productListId) {
        this._loadProductList(productListId);
      }
    });
  }

  ionViewWillEnter() {
    if (this.productList.id) {
      this._loadProductList(this.productList.id);
    }
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('productlist');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  share() {
    const userName = this.userStore.user$.value?.creatorAccount.userName;
    const message = `Folge der Liste "${this.productList.name}" von @${userName} auf wantic und lass dich inspirieren! 🥳🎁🤩`;
    const link = `${APP_URL}/creator/${userName}/${this.productList.name}`;
    shareLink(link, 'Einladung zur Liste', message).catch(reason => {
      this.logger.error(link, reason);
    });
  }

  forceRefresh(event: Event) {
    const refresherEvent = event as RefresherCustomEvent;
    this.productListStore.getById(this.productList.id, true).pipe(
      first(),
      finalize(() => {
        refresherEvent.target.complete();
      })
    ).subscribe({
      next: refreshedList => {
        this.productList = refreshedList;
      }
    })
  }

  trackById: TrackByFunction<Product> = (idx, product) => product.id;

  navigateToProductDetailPage(product: Product) {
    this.router.navigate(['product', product.id], {
      relativeTo: this.route,
      state: { product }
    })
  }

  private _loadProductList(id: string): void {
    this.productListStore.getById(id).pipe(first()).subscribe(productList => {
      this.productList = productList;
    }
    )
  }

}
