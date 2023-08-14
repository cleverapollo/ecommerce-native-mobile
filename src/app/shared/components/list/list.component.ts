import { Component, Input } from '@angular/core';
import { Product, ProductList } from '@core/models/product-list.model';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { WishImageComponentStyles } from '../wish-image/wish-image.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  @Input() list: ProductList | WishListDto;
  @Input() index: number;

  get side(): string {
    if (this.index % 2 === 0) {
      return 'right';
    } else if (this.index % 2 === 1) {
      return 'left';
    } else {
      return 'center';
    }
  }

  get itemImageStyle(): WishImageComponentStyles {
    return {
      container: {
        display: 'flex',
        'justify-content': 'center',
        height: '100%'
      },
      errorImg: {
        padding: '5px'
      },
      placeholderImg: {
        padding: '5px'
      }
    }
  }

  get isWishList(): boolean {
    return this.list['wishes'] !== undefined;
  }

  get items(): WishDto[] | Product[] {
    return this.isWishList ?
      (this.list as WishListDto).wishes || [] :
      (this.list as ProductList).products || [];
  }

  get date(): Date | null {
    return this.isWishList ? (this.list as WishListDto).date : null;
  }

}
