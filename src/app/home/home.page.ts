import { Component, OnInit } from '@angular/core';
import { WishList } from './wishlist.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  wishLists: Array<WishList> = new Array();

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

}
