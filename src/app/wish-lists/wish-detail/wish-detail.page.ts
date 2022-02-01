import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { BrowserService } from '@core/services/browser.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController, NavController } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { WishShopInfoComponentStyles } from '@shared/components/wish-shop-info/wish-shop-info.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto
  wish: WishDto;
  
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
        'font': 'normal normal 900 18px/20px Roboto' 
      }
    }
  }

  get wishImageComponentStyles(): WishImageComponentStyles {
    let style  = {};
    if (!this.wish.imageUrl) {
      style['height'] = '70%';
    }
    return { img: style };
  }

  cssClass(first: boolean, last: boolean) {
    return {
      'standalone': this.wishListOwnerCount == 1,
      'first': this.wishListOwnerCount > 1 && first,
      'last': this.wishListOwnerCount > 1 && last
    }
  }

  private affiliateLink: string = '';
  private loadWishSubscription: Subscription;

  constructor(
    private browserService: BrowserService,
    private navController: NavController,
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
  }

  ionViewWillEnter() {
    this.loadWish();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-wish');
  }

  ngOnDestroy() {
    this.loadWishSubscription?.unsubscribe();
  }

  openProductURL() {
    this.browserService.openInAppBrowser(this.affiliateLink);
  }

  goBack() {
    this.navController.back();
  }

  forceRefresh(event) {
    this.loadWishSubscription = this.wishListStore.loadWish(this.wish.id, true).subscribe({
      next: wish => {
        this.wish = wish;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

  private async loadWish() {
    const wish = await this.wishListStore.loadWish(this.wish.id).toPromise();
    this.wish = wish;
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
 
}
