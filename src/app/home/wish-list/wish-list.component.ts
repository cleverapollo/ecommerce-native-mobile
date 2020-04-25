import { Component, OnInit, Input } from '@angular/core';
import { WishListDto } from 'src/app/shared/models/wish-list.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {

  @Input() wishList: WishListDto

  wishListPartnersImageUrls: String[] = [];

  constructor() {}

  ngOnInit() {
    if (this.wishList.partner && this.wishList.partner.profileImageUrl) {
      this.wishListPartnersImageUrls.push(this.wishList.partner.profileImageUrl);
    }
  }

}
