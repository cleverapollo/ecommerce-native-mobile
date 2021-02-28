import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListStoreService } from '@core/services/wish-list-store.service';

import { Plugins } from '@capacitor/core';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { LogService } from '@core/services/log.service';
import { NavigationService } from '@core/services/navigation.service';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { first } from 'rxjs/operators';
const { Share } = Plugins;

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  private subscriptionAccountEnabled: Subscription;
  private queryParamSubscription: Subscription;

  wishList: WishListDto;
  refreshWishListData: boolean = false
  showBackButton: boolean = true;
  accountIsNotActivated: boolean;

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

  constructor(
    private navController: NavController,
    private wishListApiService: WishListApiService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private wishListStore: WishListStoreService,
    private userProfileStore: UserProfileStore,
    private logger: LogService,
    private userService: UserService
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

    this.subscriptionAccountEnabled = this.userService.$accountIsEnabled.subscribe({
      next: accountIsEnabled => {
        this.logger.debug('enabled', accountIsEnabled);
        this.accountIsNotActivated = !accountIsEnabled;
      }
    })
  }

  ionViewWillEnter() { 
    if (this.refreshWishListData) {
      this.wishListStore.loadWishList(this.wishList.id).subscribe( wishList => {
        this.wishList = wishList;
      })
    }
  }

  ionViewDidLeave() {
    this.refreshWishListData = true;
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
    this.subscriptionAccountEnabled.unsubscribe();
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

  async shareWishList() {
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    const message = `Hurra, ${userProfile.firstName} möchte feiern. 🥳 Sie dir die Wunschliste „${this.wishList.name}“ an und finde ein Geschenk.🎁🤩`;
    const subject = 'Einladung zur Wunschliste';
    this.wishListApiService.getLinkForSocialSharing(this.wishList.id).toPromise().then( link => {
      Share.share({
        title: subject,
        text: message,
        url: link.value
      }).catch(reason => {
        this.logger.error(reason);
        this.logger.log(link);
      });
    });
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
