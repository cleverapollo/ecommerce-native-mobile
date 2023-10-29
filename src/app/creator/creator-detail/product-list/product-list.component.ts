import { Component, Input } from '@angular/core';
import { ProductList } from '@core/models/product-list.model';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {

  @Input() productList: ProductList;

  readonly wishComponentStyles: WishImageComponentStyles = {
    container: {
      display: 'flex',
      'justify-content': 'center',
      height: '100%'
    },
  }

}
