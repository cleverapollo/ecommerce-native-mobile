import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { ModalController, NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { BrowserService } from '@core/services/browser.service';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';
import { environment } from '@env/environment';
import { BackendConfigType } from '@env/backend-config-type';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';

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

  cssClass(first: boolean, last: boolean) {
    return {
      'standalone': this.wishListOwnerCount == 1,
      'first': this.wishListOwnerCount > 1 && first,
      'last': this.wishListOwnerCount > 1 && last
    }
  }

  private affiliateLink: string = '';

  constructor(
    private browserService: BrowserService,
    public alertService: AlertService,
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
  }

  openProductURL() {
    this.browserService.openInAppBrowser(this.affiliateLink);
  }

  goBack() {
    this.navController.back();
  }

  forceRefresh(event) {
    this.wishListStore.loadWish(this.wish.id, true).pipe(first()).subscribe({
      next: wish => {
        this.wish = wish;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

  onImgLoadingError(event) {
    event.target.src = 'assets/images/wish-list-placeholder.svg';
    event.target.alt = 'Das Bild zeigt ein Quadrat mit einem Fragezeichen. Es stellt dar, dass es einen Fehler beim Laden des Bildes gegeben hat.';
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
