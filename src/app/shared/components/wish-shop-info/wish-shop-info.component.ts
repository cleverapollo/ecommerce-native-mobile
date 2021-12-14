import { Component, Input, OnInit } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

export interface WishShopInfoComponentStyles {
  shopInfoOverlay: { [className: string]: string };
  iconStar: { [className: string]: string };
  shopLogoContainer: { [className: string]: string };
  priceInfo: { [className: string]: string }
}

@Component({
  selector: 'app-wish-shop-info',
  templateUrl: './wish-shop-info.component.html',
  styleUrls: ['./wish-shop-info.component.scss'],
})
export class WishShopInfoComponent implements OnInit {

  @Input() wish: WishDto | FriendWish;
  @Input() styles: WishShopInfoComponentStyles = this.defaultStyles;

  get priceDisplayString(): string {
    return this.wish?.price?.displayString || 'Lädt ...';
  }

  get fillIconCSSClass(): string {
    let cssClass = 'fill-gray';
    if (this.wish?.isFavorite) {
      cssClass = 'fill-primary';
    } 
    return cssClass;
  }

  get shopLogoUrl(): String {
    return null;
  }

  private get defaultStyles(): WishShopInfoComponentStyles {
    return {
      shopInfoOverlay: { 
        'min-width':  '42px',
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
        'font': 'normal normal 900 13px/20px Roboto'
      }
    }
  }

  constructor() { }

  ngOnInit() {}

}
