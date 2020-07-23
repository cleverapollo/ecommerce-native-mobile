import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list-detail',
  templateUrl: './wish-list-detail.page.html',
  styleUrls: ['./wish-list-detail.page.scss'],
})
export class WishListDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription

  wishList: WishListDto;
  subText = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wünsche zu deiner Wunschliste hinzufügen.';

  get userIsUnverified(): Boolean {
    const userRole: string = this.route.snapshot.data.userRole;
    return userRole === 'ROLE_USER_UNVERIFIED';
  }

  constructor(
    private route: ActivatedRoute,
    private wishListService: WishListService, 
    private navController: NavController
  ) { }

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

  selectWish(wish: WishDto) {
    this.wishListService.updateSelectedWish(wish);
    this.navController.navigateForward('tabs/home/wish-list-detail/wish-detail');
  }

  goBack() {
    this.navController.back();
  }

}
