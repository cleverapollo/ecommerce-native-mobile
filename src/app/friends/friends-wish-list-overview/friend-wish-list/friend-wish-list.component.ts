import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FriendWishList } from '../friends-wish-list-overview.model';

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

  constructor(private datePipe: DatePipe) { }

}
