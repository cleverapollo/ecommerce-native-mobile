import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wish } from '../home/wishlist.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';
import { NavController } from '@ionic/angular';
import { WishListDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription

  wishList: WishListDto;

  constructor(private router: Router, private wishListService: WishListService, private navController: NavController) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
  }

  ionViewWillEnter() { 
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectWish(wish: Wish) {
    this.wishListService.updateSelectedWish(wish);
    this.router.navigate(['wish-detail']);
  }

  goBack() {
    this.navController.navigateBack('/home');
  }

}
