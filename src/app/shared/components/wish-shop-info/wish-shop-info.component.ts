import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FriendWish, WishDto } from '@core/models/wish-list.model';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { LOADING_STRING } from '@core/ui.constants';
import { finalize, first } from 'rxjs/operators';

export interface WishShopInfoComponentStyles {
  shopInfoOverlay: CSSStyle;
  iconStar: CSSStyle;
  shopLogoContainer: CSSStyle;
  priceInfo: CSSStyle
}

@Component({
  selector: 'app-wish-shop-info',
  templateUrl: './wish-shop-info.component.html',
  styleUrls: ['./wish-shop-info.component.scss'],
})
export class WishShopInfoComponent {

  @Input() wish: WishDto | FriendWish;
  @Input() styles: WishShopInfoComponentStyles = this.defaultStyles;
  @Input() toggleIsFavorite = false;

  @Output() wishUpdate = new EventEmitter<boolean>();

  get priceDisplayString(): string {
    return this.wish?.price?.displayString || LOADING_STRING;
  }

  get fillIconCSSClass(): string {
    let cssClass = 'fill-gray';
    if (this.wish?.isFavorite) {
      cssClass = 'fill-primary';
    }
    return cssClass;
  }

  get shopLogoUrl(): string | null {
    return null;
  }

  private get defaultStyles(): WishShopInfoComponentStyles {
    return {
      shopInfoOverlay: {
        'min-width': '42px',
        'min-height': '39px',
        'text-align': 'center',
        'margin-top': '-2px' // - var(--wish-card-border-width);
      },
      iconStar: {
        'font-size': '13px'
      },
      shopLogoContainer: {
      },
      priceInfo: {
        'letter-spacing': '-0.46px',
        font: 'normal normal 900 13px/20px Roboto'
      }
    }
  }

  private _isUpdating = false;

  set isUpdating(value: boolean) {
    this._isUpdating = value;
    this.wishUpdate.next(value);
  }
  get isUpdating(): boolean {
    return this._isUpdating;
  }

  constructor(
    private wishListStore: WishListStoreService,
    private toastService: CoreToastService
  ) { }

  onStarIconClicked() {
    if (!this.toggleIsFavorite || this.isUpdating) {
      return;
    }
    const wish = { ...this.wish };
    wish.isFavorite = !this.wish.isFavorite;

    this.isUpdating = true;
    this.wishListStore.updateWish(wish).pipe(
      first(),
      finalize(() => {
        this.isUpdating = false;
      })
    ).subscribe({
      next: updatedWish => {
        this.wish = updatedWish;
        this.toastService.presentSuccessToast('Wunsch aktualisiert');
      },
      error: () => {
        this.toastService.presentErrorToast('Fehler beim Aktualisieren');
      }
    });
  }

}
