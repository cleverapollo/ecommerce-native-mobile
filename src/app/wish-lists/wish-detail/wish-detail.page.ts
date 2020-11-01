import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { BrowserService } from '@core/services/browser.service';
import { ProfileImageDto } from '@core/models/user.model';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto
  wish: WishDto

  get ownerProfileImageInfos(): ProfileImageDto[] {
    const imagesUrls = this.wishList.ownerProfileImageInfos
        .filter(imageInfo => imageInfo !== null)
        .map(imageInfo => imageInfo);
    return imagesUrls;
  }

  constructor(
    private browserService: BrowserService,
    public alertService: AlertService,
    private navController: NavController,
    private route: ActivatedRoute,
    private wishListStore: WishListStoreService
    ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.wish = this.route.snapshot.data.wish;
  }

  ngOnDestroy() {}

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

  goBack() {
    this.navController.back();
  }

  forceRefresh(event) {
    this.wishListStore.loadWish(this.wish.id, true).subscribe(wish => {
      this.wish = wish;
    }, console.error, () => {
      event.target.complete();
    })
  }

}
