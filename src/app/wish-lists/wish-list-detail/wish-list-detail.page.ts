import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { ActivatedRoute } from '@angular/router';
import { WishListStoreService } from '@core/services/wish-list-store.service';

import { Plugins } from '@capacitor/core';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { LogService } from '@core/services/log.service';
import { NavigationService } from '@core/services/navigation.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { APP_URL } from 'src/environments/environment';
import { AnalyticsService } from '@core/services/analytics.service';

const { Share, SplashScreen } = Plugins;

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  private queryParamSubscription: Subscription;

  wishList: WishListDto;
  showBackButton: boolean = true;

  get wishListOwnerCount(): number {
    return this.wishList?.owners?.length || 0;
  }

  get showReservedWishes(): boolean {
    return this.wishList?.showReservedWishes || false;
  }

  cssClass(first: boolean, last: boolean) {
    return {
      'standalone': this.wishListOwnerCount == 1,
      'first': this.wishListOwnerCount > 1 && first,
      'last': this.wishListOwnerCount > 1 && last
    }
  }

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private wishListStore: WishListStoreService,
    private userProfileStore: UserProfileStore,
    private logger: LogService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.queryParamSubscription = this.route.queryParamMap.subscribe(queryParamMap => {
      if (Boolean(queryParamMap.get('forceRefresh'))) {
        this.wishListStore.loadWishList(this.wishList.id, true).subscribe({
          next: wishList => this.wishList = wishList,
          complete: () => this.navigationService.removeQueryParamFromCurrentRoute('forceRefresh')
        })
      }
    })
  }

  ionViewWillEnter() { 
    this.wishListStore.loadWishList(this.wishList.id).subscribe( wishList => {
      this.wishList = wishList;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist');
    SplashScreen.hide({
      fadeOutDuration: 500
    });
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
  }

  selectWish(wish: WishDto) {
    this.navController.navigateForward(`secure/home/wish-list/${this.wishList.id}/wish/${wish.id}`);
  }

  goBack() {
    this.navController.back();
  }

  goToSearchSelectionPage() {
    this.navController.navigateForward('secure/home/wish-search-selection');
  }

  editWishList() {
    this.navController.navigateForward(`secure/home/wish-list/${this.wishList.id}/edit`);
  }

  async shareWishList() {
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    const message = `Hurra, ${userProfile.firstName} möchte feiern. 🥳 Sieh dir die Wunschliste „${this.wishList.name}“ an und finde ein Geschenk.🎁🤩`;
    const link = this.createLinkForSocialSharing();
    Share.share({
      title: 'Einladung zur Wunschliste',
      text: message,
      url: this.createLinkForSocialSharing()
    }).catch(reason => {
      this.logger.debug(link, reason);
    });
  }

  private createLinkForSocialSharing(appUrl: string = APP_URL, wishListId: string = this.wishList.id) {
    return `${appUrl}/meine-wunschliste/${wishListId}`
  }

  forceRefresh(event) {
    this.wishListStore.loadWishList(this.wishList.id, true).pipe(first()).subscribe({
      next: wishList => {
        this.wishList = wishList;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

}
