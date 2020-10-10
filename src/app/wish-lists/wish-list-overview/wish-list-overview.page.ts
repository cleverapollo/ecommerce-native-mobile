import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Component({
  selector: 'app-wish-list-overview',
  templateUrl: './wish-list-overview.page.html',
  styleUrls: ['./wish-list-overview.page.scss'],
})
export class WishListOverviewPage implements OnInit {

  wishLists: Array<WishListDto> = new Array();
  subText: string = 'Wenn deine E-Mail-Adresse bestätigt ist kannst du hier neue Wunschlisten und Wünsche hinzufügen.';
  refreshData: boolean = false

  get title(): string {
    return this.wishLists.length > 1 ? 'Meine Wunschlisten' : 'Meine Wunschliste';
  } 

  constructor(
    private route: ActivatedRoute, 
    private wishListStore: WishListStoreService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  ionViewWillEnter() {
    if (this.refreshData) {
      this.wishListStore.loadWishLists(false).subscribe( wishLists => {
        this.wishLists = wishLists;
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
    this.wishListStore.loadWishLists(true).subscribe(wishLists => {
      this.wishLists = wishLists;
    }, console.error, () => {
      event.target.complete();
    })
  }

}
