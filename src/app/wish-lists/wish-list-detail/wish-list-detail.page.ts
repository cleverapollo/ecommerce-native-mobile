import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
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
export class WishListDetailPage implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('masonry') masonry: ElementRef<HTMLDivElement>;
  @ViewChildren('bricks') masonryBricks: QueryList<ElementRef<HTMLDivElement>>;

  wishList = new WishListDto();

  get wishes(): WishDto[] {
    const wishes = this.wishList.wishes;
    wishes.sort(sortWishesByIsFavorite);
    return wishes;
  }

  trackByWishId: TrackByFunction<WishDto> = (idx, wish) => wish.id;

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wishListStore: WishListStoreService,
    private userProfileStore: UserProfileStore,
    private logger: Logger,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.subscription = this.wishListStore.wishLists.subscribe({
      next: wishLists => {
        const wishList = wishLists.find(w => w.id === this.wishList.id);
        if (wishList) {
          this.wishList = wishList;
        }
      }
    });
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
    this.subscription?.unsubscribe();
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

  async forceRefresh(event: Event) {
    const refresherEvent = event as RefresherCustomEvent;
    await this.wishListStore.loadWishList(this.wishList.id, true).pipe(
      first(),
      finalize(() => {
        refresherEvent.target.complete();
      })
    ).toPromise();
  }

  navigateToWishDetailPage(wish: WishDto) {
    this.router.navigate(['wish', wish.id], { relativeTo: this.route })
  }

}
