import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { ProductList } from '@core/models/product-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { APP_URL } from '@env/environment';
import { RefresherCustomEvent } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-detail',
  templateUrl: './product-list-detail.page.html',
  styleUrls: ['./product-list-detail.page.scss'],
})
export class ProductListDetailPage implements OnInit, OnDestroy {

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
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const id = params['productListId'];
      if (id) {
        this._init(id);
      }
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('productlist');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  share() {
    const userName = this.userStore.user$.value.creatorAccount.userName;
    const message = `Folge der Liste "${this.productList.name}" von @${userName} auf wantic und lass dich inspirieren! 🥳🎁🤩`;
    const link = `${APP_URL}/creator/${userName}/${this.productList.name}`;
    Share.share({
      title: 'Einladung zur Liste',
      text: message,
      url: link
    }).catch(reason => {
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

  private async _init(id: string) {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.getById(id, false).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: productList => {
        this.productList = productList;
      }
    })
  }

}
