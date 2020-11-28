import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Location } from '@angular/common';
import { LoginResponse, WanticJwtToken } from '@core/models/login.model';

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
    private location: Location
  ) { }

  ngOnInit() {
    this.initData();
    this.handleEmailVerfificationResponseIfNeeded();
  }

  initData() {
    const resolvedData = this.route.snapshot.data;
    this.wishLists = resolvedData.wishLists;
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
        this.wishLists = wishLists;
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
      this.wishLists = wishLists;
    }, console.error, () => {
      event.target.complete();
    })
  }

}
