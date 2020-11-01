import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { ActivatedRoute } from '@angular/router';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ProfileImageDto } from '@core/models/user.model';

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  wishList: WishListDto;
  refreshWishListData: boolean = false
  subText = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wünsche zu deiner Wunschliste hinzufügen.';

  get ownerProfileImageInfos(): ProfileImageDto[] {
    const imagesUrls = this.wishList.ownerProfileImageInfos
        .filter(imageInfo => imageInfo != null)
        .map(imageInfo => imageInfo);
    return imagesUrls;
  }

  constructor(
    private navController: NavController,
    private wishListApiService: WishListApiService,
    private route: ActivatedRoute,
    private wishListStore: WishListStoreService,
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

  shareWishList() {
    this.wishListApiService.getLinkForSocialSharing(this.wishList.id).toPromise().then( link => {
      console.log(link);
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
