import { Component, OnInit, Input } from '@angular/core';
import { WishListDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {

  @Input() wishList: WishListDto
  @Input() index: number;

  constructor() {}

  ngOnInit() {}

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
