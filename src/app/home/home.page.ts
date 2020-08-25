import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';
import { WishListDto } from '../shared/models/wish-list.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  wishLists: Array<WishListDto> = new Array();
  subText: string = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wunschlisten und Wünsche hinzufügen.';

  constructor(
    private route: ActivatedRoute, 
    private wishListService: WishListService,
    private navController: NavController
    ) {}

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  ionViewWillEnter() {
    this.wishLists = this.route.snapshot.data.wishLists;
    this.wishListService.clearSelectedWishList();
  }

  selectWishList(wishList: WishListDto) {
    this.wishListService.updateSelectedWishList(wishList);
    this.navController.navigateForward('secure/home/wish-list-detail');
  }

}
