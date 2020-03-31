import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wish-list-wish',
  templateUrl: './wish-list-wish.page.html',
  styleUrls: ['./wish-list-wish.page.scss'],
})
export class WishListWishPage implements OnInit {

  keywords: String

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private navController: NavController) { }

  ngOnInit() {}

  search() {
    this.router.navigate(['../search-results'], { relativeTo: this.activatedRoute, queryParams: { keywords: this.keywords } })
  }

  goBack() {
    this.navController.back();
  }

}
