import { Component, OnInit } from '@angular/core';
import { WishList } from './wishlist.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  get wishLists(): Array<WishList> {
    return this.route.snapshot.data.wishLists;
  }

  constructor(private route: ActivatedRoute) {
   
  }

  ngOnInit() {
    console.log(this.route.snapshot.data)
  }

}
