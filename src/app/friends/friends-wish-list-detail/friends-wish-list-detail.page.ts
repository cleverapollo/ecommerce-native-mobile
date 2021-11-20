import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LogService } from '@core/services/log.service';
import { AlertService } from '@core/services/alert.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit, OnDestroy {

  wishList: FriendWishList;
  
  private wishListId: string;

  // subscriptions
  private loadWishListSubscription: Subscription = null;
  private routeParamSubscription: Subscription = null;
  private forceRefreshWishListSubscription: Subscription = null;
  
  constructor(
    private navController: NavController, 
    private route: ActivatedRoute,
    private router: Router,
    private sharedWishListStore: FriendWishListStoreService,
    private analyticsService: AnalyticsService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private toastService: CoreToastService
  ) { }

  ngOnInit() {
    this.routeParamSubscription = this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
    })
  }

  ionViewWillEnter() {
    this.loadWishListSubscription = this.sharedWishListStore.loadWishList(this.wishListId).subscribe(wishList => {
      this.wishList = wishList;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-family_friends');
  }

  ngOnDestroy() {
    this.routeParamSubscription?.unsubscribe();
    this.loadWishListSubscription?.unsubscribe();
    this.forceRefreshWishListSubscription?.unsubscribe();
  }

  goBack() {
    this.navController.navigateBack('/friends-wish-list-overview');
  }

  updateWish(updatedWish: FriendWish) {
    const index = this.wishList.wishes.findIndex( w => w.id === updatedWish.id );
    if (index !== -1) {
      this.wishList.wishes[index] = updatedWish;
      this.sharedWishListStore.updateCachedWishList(this.wishList);
    }
  } 

  async showDeleteAlert() {
    const header = 'Wunschliste verlassen?';
    const message = 'Sie wird dir nicht mehr angezeigt und deine reservierten Wünsche werden wieder freigegeben. Du kannst diese Aktion nicht mehr rückgängig machen.'
    const alert = await this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation);
    alert.present();
  }

  private onDeleteConfirmation = () => {
    this.loadingService.showLoadingSpinner();
    this.sharedWishListStore.removeWishListById(this.wishListId).then(() => {
      this.loadingService.dismissLoadingSpinner();
      this.toastService.presentSuccessToast('Du hast die Wunschliste erfolgreich verlassen.');
      this.router.navigateByUrl('/secure/friends-home/friends-wish-list-overview?forceRefresh=true');
    }, () => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

  forceRefresh(event: any) {
    this.forceRefreshWishListSubscription = this.sharedWishListStore.loadWishList(this.wishList.id, true).subscribe({
      next: wishList => {
        this.wishList = wishList;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }
}
