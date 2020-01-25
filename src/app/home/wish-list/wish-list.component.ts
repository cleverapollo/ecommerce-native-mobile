import { Component, OnInit, Input } from '@angular/core';
import { WishList } from '../wishlist.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {

  @Input() wishList: WishList

  constructor() {
    console.log(this.wishList)
  }

  ngOnInit() {}

}
