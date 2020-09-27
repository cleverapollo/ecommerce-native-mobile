import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishListService } from '@core/services/wish-list.service';
import { Subscription } from 'rxjs';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private wishListSubscription: Subscription;

  wishList: WishListDto
  wish: WishDto

  constructor(
    private inAppBrowser: InAppBrowser,
    public alertService: AlertService,
    private wishListService: WishListService, 
    private navController: NavController
    ) { }

  ngOnInit() {
    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
    this.subscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }

  openProductURL() {
    const url = this.wish.productUrl
    const browser = this.inAppBrowser.create(url);
    browser.show();
  }

  goBack() {
    this.navController.back();
  }

}
