import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FriendWishList } from '@core/models/wish-list.model';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';

@Component({
  selector: 'app-friend-wish-list',
  templateUrl: './friend-wish-list.component.html',
  styleUrls: ['./friend-wish-list.component.scss'],
})
export class FriendWishListComponent {

  @Input() wishList: FriendWishList;

  get date(): string {
    let dateString  = 'noch kein Datum festgelegt';
    if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  readonly wishComponentStyles: WishImageComponentStyles = {
    container: {
      display: 'flex',
      'justify-content': 'center',
      height: '100%'
    },
  }

  constructor(private datePipe: DatePipe) { }

}
