import { Component, OnInit } from '@angular/core';
import { WishList } from './wishlist.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  wishLists: Array<WishList> = new Array();

  constructor(
    private route: ActivatedRoute, 
    private wishListService: WishListService,
    private router: Router
    ) {
  }

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  ionViewWillEnter() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  selectWishList(wishList: WishList) {
    this.wishListService.updateSelectedWishList(wishList);
    this.router.navigate(['wish-list-detail']);
  }

}
