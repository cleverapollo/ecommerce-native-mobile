import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '@core/models/user.model';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { LOADING_STRING, NO_DATE_SELECTED } from '@core/ui.constants';
import { NavController } from '@ionic/angular';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  wishList: FriendWishList = null;
  wishes: FriendWish[] = [];

  get date(): string {
    let dateString = NO_DATE_SELECTED;
    if (!this.wishList) {
      dateString = LOADING_STRING;
    } else if (this.wishList?.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  get owners(): UserDto[] {
    return this.wishList?.owners || [];
  }

  get name(): string {
    return this.wishList?.name || LOADING_STRING;
  }

  trackByWishId: TrackByFunction<FriendWish> = (idx, wish) => wish.id;

  private wishListId: string = null;
  private subscriptions: Subscription = new Subscription();
  private isInitialized = false;

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
    this.wishList = this.router.getCurrentNavigation()?.extras.state?.wishList;
    this.wishes = this.wishList?.wishes;
    this.subscriptions.add(this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
      this.isInitialized = true;
    }));
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewWillEnter() {
    if (this.isInitialized) {
      this.sharedWishListStore.loadWishList(this.wishListId, true).subscribe(wishList => {
        this.wishList = wishList;
        this.wishes = this.wishList.wishes;
      })
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist-family_friends');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  goBack() {
    this.navController.navigateBack('/friends-wish-list-overview');
  }

  updateWish(updatedWish: FriendWish) {
    const index = this.wishList.wishes.findIndex(w => w.id === updatedWish.id);
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

  private onDeleteConfirmation = async () => {
    try {
      await this.loadingService.showLoadingSpinner();
      await this.sharedWishListStore.removeWishListById(this.wishListId);
      await this.loadingService.stopLoadingSpinner();
      await this.toastService.presentSuccessToast('Du hast die Wunschliste erfolgreich verlassen.');
      return await this.router.navigateByUrl('/secure/friends-home/friends-wish-list-overview');
    } catch (error) {
      this.loadingService.stopLoadingSpinner().catch(() => Promise.resolve());
      return Promise.resolve();
    }
  }

  forceRefresh(event: any) {
    this.sharedWishListStore.loadWishList(this.wishList.id, true)
      .pipe(
        first(),
        finalize(() => {
          event.target.complete();
        })
      )
      .subscribe({
        next: wishList => {
          this.wishList = wishList;
        }
      });
  }
}
