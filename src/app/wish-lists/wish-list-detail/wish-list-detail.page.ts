import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { ActivatedRoute } from '@angular/router';
import { WishListStoreService } from '@core/services/wish-list-store.service';

import { Plugins } from '@capacitor/core';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
const { Share } = Plugins;

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto;
  refreshWishListData: boolean = false
  showBackButton: boolean = true

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
    private wishListStore: WishListStoreService,
    private userProfileStore: UserProfileStore
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
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

  ngOnDestroy() {}

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
    const message = `Hey, ${userProfile.firstName} hat sich zur Wunschliste ${this.wishList.name} eingeladen. Schau doch einfach mal vorbei, ob du einen Wunsch erfüllen kannst. Eine Anmeldung ist hierfür nicht notwendig.`;
    const subject = 'Einladung zur Wunschliste';
    this.wishListApiService.getLinkForSocialSharing(this.wishList.id).toPromise().then( link => {
      Share.share({
        title: subject,
        text: message,
        url: link.value
      }).catch(reason => {
        console.error(reason);
        console.log(link);
      });
    });
  }

  forceRefresh(event) {
    this.wishListStore.loadWishList(this.wishList.id, true).subscribe(wishList => {
      this.wishList = wishList;
    }, console.error, () => {
      event.target.complete();
    })
  }

}
