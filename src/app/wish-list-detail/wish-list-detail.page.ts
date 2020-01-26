import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishList } from '../home/wishlist.model';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { map, filter } from 'rxjs/operators'
import { WishListService } from '../shared/services/wish-list.service';

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription

  wishList: WishList;

  constructor(private wishListService: WishListService) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
