import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, ProductList } from '@core/models/product-list.model';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { Logger } from '@core/services/log.service';
import { APP_URL } from '@env/environment';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { shareLink } from '@shared/helpers/share.helper';
import { WishImageComponentStyles } from '../wish-image/wish-image.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  @Input() list: ProductList | WishListDto;
  @Input() index: number;

  @Output() listSelected = new EventEmitter<ProductList | WishListDto>();

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

  get isProductList(): boolean {
    return this.list['products'] !== undefined;
  }

  get items(): WishDto[] | Product[] {
    return this.isWishList ?
      (this.list as WishListDto).wishes || [] :
      (this.list as ProductList).products || [];
  }

  get date(): Date | null {
    return this.isWishList ? (this.list as WishListDto).date : null;
  }

  constructor(private logger: Logger, private userStore: UserProfileStore) { }

  share() {
    const userName = this.userStore.user$.value.creatorAccount?.userName;
    const message = `Folge der Liste "${this.list.name}" von @${userName} auf wantic und lass dich inspirieren! 🥳🎁🤩`;
    const link = `${APP_URL}/creator/${userName}/${this.list.name}`;
    shareLink(link, `👉 Folge der Liste "${this.list.name}" von @${userName}`, message).catch(error => {
      this.logger.error(link, error);
    });
  }

  onListSelected() {
    this.listSelected.emit(this.list);
  }

}
