import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { AlertService } from '@core/services/alert.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit, OnDestroy {

  wishList: FriendWishList;

  get date(): string {
    let dateString  = 'noch kein Datum festgelegt';
    if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

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
    private toastService: CoreToastService,
    private datePipe: DatePipe
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
    const numberOfReservedWishes = this.wishList.wishes.map(wish => wish.bought).length;
    const header = 'Wunschliste verlassen?';
    let message = `Bist du dir sicher, dass du die Wunschliste verlassen möchtest? <br><br>
    Du kannst dann nicht mehr darauf zugreifen.
    `
    if (numberOfReservedWishes > 0) {
      message += '<br><br>'
      message += `<strong>Hinweis:</strong> Du hast noch Wünsche für dich reserviert.
      Die Reservierungen bleiben auch nach dem Verlassen der Wunschliste bestehen.
      ` // ToDo: add pluralized message
    }
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
