import { Component, Input } from '@angular/core';
import { WishListDto } from '@core/models/wish-list.model';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent {

  @Input() wishList: WishListDto
  @Input() index: number;

  constructor() {}

  get side(): string {
    if (this.index % 2 === 0) {
      return 'right';
    } else if (this.index % 2 === 1) {
      return 'left';
    } else {
      return 'center';
    }
  }

  get wishImageStyle(): WishImageComponentStyles {
    return {
      errorImg: {
        padding: '5px'
      },
      placeholderImg: {
        padding: '5px'
      }
    }
  }

}
