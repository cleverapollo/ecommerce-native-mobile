import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Location } from '@angular/common';
import { LoginResponse, WanticJwtToken } from '@core/models/login.model';
import { LogService } from '@core/services/log.service';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit {

  wishLists: Array<WishListDto> = new Array();
  emailVerificationResponse?: LoginResponse;
  refreshData: boolean = false

  constructor(
    private route: ActivatedRoute, 
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private authService: AuthenticationService,
    private location: Location,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.initData();
    this.handleEmailVerfificationResponseIfNeeded();
  }

  initData() {
    const resolvedData = this.route.snapshot.data;
    this.updateWishLists(resolvedData.wishLists)
    this.emailVerificationResponse = resolvedData.emailVerificationResponse;
  }

  handleEmailVerfificationResponseIfNeeded() {
    if (this.emailVerificationResponse) {
      const jwToken = this.emailVerificationResponse.token;
      if (jwToken) {
        this.authService.saveToken(jwToken);
      }
      this.location.replaceState('secure/home/wish-list-overview')
    }
  }

  ionViewWillEnter() {
    if (this.refreshData) {
      this.wishListStore.loadWishLists(false).subscribe( wishLists => {
        this.updateWishLists(wishLists)
      })
    }
  }

  ionViewDidLeave() {
    this.refreshData = true;
  }

  selectWishList(wishList: WishListDto) {
    this.navController.navigateForward(`secure/home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.wishListStore.loadWishLists(true).subscribe(wishLists => {
      this.updateWishLists(wishLists);
    }, this.logger.error, () => {
      event.target.complete();
    })
  }

  private updateWishLists(wishLists: Array<WishListDto>) {
    this.wishLists = wishLists;
    this.wishLists.sort((wishListA, wishListB) => {
      return this.getTime(wishListA.date) - this.getTime(wishListB.date);
    })
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : new Date(3000, 1).getTime();
  }

}
