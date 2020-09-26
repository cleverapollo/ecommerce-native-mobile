import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '../shared/models/wish-list.model';
import { WishListService } from '../shared/services/wish-list.service';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit {

  wishLists: Array<WishListDto> = new Array();
  subText: string = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wunschlisten und Wünsche hinzufügen.';
  get title(): string {
    return this.wishLists.length > 1 ? 'Meine Wunschlisten' : 'Meine Wunschliste';
  } 

  constructor(
    private route: ActivatedRoute, 
    private wishListService: WishListService,
    private navController: NavController
  ) { }

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
