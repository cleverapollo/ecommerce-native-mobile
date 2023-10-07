import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { UserWishListDto } from '@core/models/user.model';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { LOADING_STRING, NO_DATE_SELECTED } from '@core/ui.constants';
import { sortWishesByIsFavorite } from '@core/wish-list.utils';
import { RefresherCustomEvent } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Masonry } from '@shared/masonry';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { APP_URL } from 'src/environments/environment';

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss']
})
export class WishListDetailPage implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  showBackButton = true;
  wishListId?: string = null;
  wishList = new WishListDto();

  get wishes(): WishDto[] {
    const wishes = this.wishList?.wishes || [];
    wishes.sort(sortWishesByIsFavorite);
    return wishes;
  }

  get owners(): UserWishListDto[] {
    return this.wishList?.owners || [];
  }

  get date(): string {
    let dateString = NO_DATE_SELECTED;
    if (!this.wishList) {
      dateString = LOADING_STRING;
    } else if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  get name(): string {
    return this.wishList?.name || LOADING_STRING;
  }

  trackByWishId: TrackByFunction<WishDto> = (idx, wish) => wish.id;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wishListStore: WishListStoreService,
    private userProfileStore: UserProfileStore,
    private logger: Logger,
    private analyticsService: AnalyticsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.wishList = this.router.getCurrentNavigation()?.extras.state?.wishList;
    this.subscription.add(this.route.paramMap.subscribe(paramMap => {
      this.wishListId = paramMap.get('wishListId');
    }));
  }

  ionViewWillEnter() {
    this.refreshWishList(this.wishList?.id || this.wishListId);
  }

  ngAfterViewChecked(): void {
    const masonry = new Masonry(this.masonry, this.masonryBricks);
    masonry.resizeBricks();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist');
    SplashScreen.hide({
      fadeOutDuration: 500
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async share() {
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    const message = `Hurra, ${userProfile.firstName} möchte feiern. 🥳 Sieh dir die Wunschliste „${this.wishList.name}“ an und finde ein Geschenk.🎁🤩`;
    const link = `${APP_URL}/meine-wunschliste/${this.wishList.id}`;
    Share.share({
      title: 'Einladung zur Wunschliste',
      text: message,
      url: link
    }).catch(reason => {
      this.logger.debug(link, reason);
    });
  }

  forceRefresh(event: Event) {
    const refresherEvent = event as RefresherCustomEvent;
    this.wishListStore.loadWishList(this.wishList.id, true).pipe(
      first(),
      finalize(() => {
        refresherEvent.target.complete();
      })
    ).subscribe(wishList => this.wishList = wishList);
  }

  navigateToWishDetailPage(wish: WishDto) {
    this.router.navigate(['wish', wish.id], {
      state: {
        wishList: this.wishList,
        wish: wish
      },
      relativeTo: this.route
    });
  }

  navigateToWishListEditPage() {
    this.router.navigate(['edit'], {
      state: {
        wishList: this.wishList
      },
      relativeTo: this.route
    });
  }

  navigateToWishSearchPage() {
    this.router.navigate(['wish-search'], {
      state: {
        wishList: this.wishList
      },
      relativeTo: this.route
    });
  }

  private refreshWishList(id: string) {
    if (!id) {
      return;
    }

    this.wishListStore.loadWishList(id, true).pipe(
      first()
    ).subscribe(wishList => this.wishList = wishList);
  }

}
