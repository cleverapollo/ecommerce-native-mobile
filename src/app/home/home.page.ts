import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';
import { WishListDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  wishLists: Array<WishListDto> = new Array();
  subText: string = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wunschlisten und Wünsche hinzufügen.';

  get userIsUnverified(): Boolean {
    const userRole: string = this.route.snapshot.data.userRole;
    return userRole === 'ROLE_USER_UNVERIFIED';
  }

  constructor(
    private route: ActivatedRoute, 
    private wishListService: WishListService,
    private router: Router
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
    this.router.navigate(['wish-list-detail']);
  }

}
