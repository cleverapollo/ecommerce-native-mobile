import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { BrowserService } from '@core/services/browser.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController, RefresherCustomEvent } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { WishShopInfoComponentStyles } from '@shared/components/wish-shop-info/wish-shop-info.component';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto;
  wish: WishDto;
  wishIsUpdating: boolean = false;

  get isDebugInfoVisible(): boolean {
    return environment.backendType === BackendConfigType.beta ||
      environment.backendType === BackendConfigType.dev;
  }

  get wishListOwnerCount(): number {
    return this.wishList?.owners?.length || 0;
  }

  get shopInfoComponentStyles(): WishShopInfoComponentStyles {
    return {
      shopInfoOverlay: {
        'min-width': '59px'
      },
      iconStar: {
        'font-size': '19px'
      },
      shopLogoContainer: {
        'max-height': '21px',
        'margin-top': '4px',
        'margin-bottom': '4px'
      },
      priceInfo: {
        'letter-spacing': '-0.63px',
        font: 'normal normal 900 18px/20px Roboto'
      }
    };
  }

  get wishImageComponentStyles(): WishImageComponentStyles {
    const img: CSSStyle = {
      padding: '10px',
      margin: 'auto',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    };
    if (!this.wish.imageUrl) {
      img.height = '70%';
    }
    return {
      img,
      container: {
        display: 'flex',
        'justify-content': 'center',
        height: '100%'
      }
    };
  }

  private affiliateLink = '';
  private subscription?: Subscription;

  constructor(
    private browserService: BrowserService,
    private route: ActivatedRoute,
    private wishListStore: WishListStoreService,
    private analyticsService: AnalyticsService,
    private affiliateLinkService: AffiliateLinkService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.wish = this.route.snapshot.data.wish;
    this.affiliateLink = await this.affiliateLinkService.createAffiliateLink(this.wish.productUrl);

    this.subscription = this.wishListStore.wishLists.subscribe({
      next: wishLists => {
        const wishList = wishLists.find(w => w.id === this.wishList.id);
        if (wishList) {
          this.wishList = wishList;
          const wish = this.wishList.wishes.find(w => w.id === this.wish.id);
          if (wish) {
            this.wish = wish;
          }
        }
      }
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-wish');
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  openProductURL() {
    this.browserService.openInAppBrowser(this.affiliateLink);
  }

  forceRefresh(event: Event) {
    const refresherEvent = event as RefresherCustomEvent;
    this.wishListStore.loadWish(this.wish.id, true).pipe(
      first(),
      finalize(() => {
        refresherEvent.target.complete();
      })
    ).subscribe({
      next: wish => {
        this.wish = wish;
      }
    });
  }

  async showDebugInfo() {
    const modal = await this.modalController.create({
      component: AffiliateLinkDebugInfoComponent,
      componentProps: {
        wish: this.wish
      },
      cssClass: 'wantic-modal',
    });
    await modal.present();
  }

  cssClass(first: boolean, last: boolean) {
    return {
      standalone: this.wishListOwnerCount === 1,
      first: this.wishListOwnerCount > 1 && first,
      last: this.wishListOwnerCount > 1 && last
    };
  }

  onWishUpdate(isUpdating: boolean) {
    this.wishIsUpdating = isUpdating;
  }

}
