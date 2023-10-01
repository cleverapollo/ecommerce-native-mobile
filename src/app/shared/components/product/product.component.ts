import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@core/models/product-list.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  get priceDisplayString(): string {
    return this.product?.price?.displayString || 'Lädt ...';
  }

  ngOnInit() { }

}
