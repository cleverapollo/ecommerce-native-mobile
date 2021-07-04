import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { first } from 'rxjs/operators';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit, OnDestroy {

  wishLists: Array<WishListDto> = new Array();
  refreshData: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private wishListStore: WishListStoreService,
    private navController: NavController,
    private analyticsService: AnalyticsService
  ) { 
    this.analyticsService.setFirebaseScreenName('main');
  }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data;
    this.updateWishLists(resolvedData.wishLists);
  }

  ngOnDestroy() {}

  ionViewWillEnter() {
    if (this.refreshData) {
      this.wishListStore.loadWishLists(false).subscribe( wishLists => {
        this.updateWishLists(wishLists)
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
    this.wishListStore.loadWishLists(true).pipe(first()).subscribe({
      next: wishLists => {
        this.updateWishLists(wishLists);
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

  private updateWishLists(wishLists: Array<WishListDto>) {
    this.wishLists = wishLists;
    this.wishLists.sort((wishListA, wishListB) => {
      if (wishListA.date === null && wishListB.date === null) {
        return wishListA.name.localeCompare(wishListB.name);
      }
      return this.getTime(wishListA.date) - this.getTime(wishListB.date);
    })
  }

  private getTime(date?: Date) {
    if (date != null) {
      return !this.dateIsInPast(date) ? new Date(date).getTime() : new Date(3000, 1).getTime();
    }
    return new Date(4000, 1).getTime();
  }

  private dateIsInPast(date: Date): boolean {
    const isoDate = new Date(date);
    const now = new Date();
    now.setHours(0,0,0,0);
    return isoDate < now;
  }

}
