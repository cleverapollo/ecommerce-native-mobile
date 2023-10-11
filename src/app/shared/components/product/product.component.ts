import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@core/models/product-list.model';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {

  @Input() product: Product;
  @Input() view: 'creator' | 'search' | 'public' = 'public';

  @Output() editButtonClick = new EventEmitter<Product>();

  get priceDisplayString(): string {
    return this.product?.price?.displayString || 'Lädt ...';
  }

  get codeColor(): string {
    return this.view === 'creator' ? 'primary-purple' : 'primary'
  }

  get couponIcon(): string {
    return this.view === 'creator' ? 'assets/icon/coupon-purple.svg' : 'assets/icon/coupon.svg'
  }

  constructor(private browserService: BrowserService) { }

  onEditButtonClicked() {
    this.editButtonClick.emit(this.product);
  }

  onShopButtonClicked() {
    this.browserService.openSystemBrowser(this.product.affiliateUrl || this.product.productUrl);
  }

  onAddButtonClicked() {

  }

}
