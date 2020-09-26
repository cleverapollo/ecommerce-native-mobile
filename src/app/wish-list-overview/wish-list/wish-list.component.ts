import { Component, OnInit, Input } from '@angular/core';
import { WishListDto } from 'src/app/shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {

  @Input() wishList: WishListDto
  @Input() index: number;

  wishListPartnersImageUrls: String[] = [];

  constructor() {}

  ngOnInit() {
    if (this.wishList.partner && this.wishList.partner.profileImageUrl) {
      this.wishListPartnersImageUrls.push(this.wishList.partner.profileImageUrl);
    }
  }

  get side() : String {
    if (this.index % 2 == 0) {
      return 'right';
    } else if (this.index % 2 == 1) {
      return 'left';
    } else {
      return 'center';
    }
  }

}
