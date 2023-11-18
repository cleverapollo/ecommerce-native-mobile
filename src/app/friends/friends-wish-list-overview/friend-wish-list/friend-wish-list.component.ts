import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from '@core/models/user.model';
import { FriendWish, FriendWishList } from '@core/models/wish-list.model';
import { NO_DATE_SELECTED } from '@core/ui.constants';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-friend-wish-list',
  templateUrl: './friend-wish-list.component.html',
  styleUrls: ['./friend-wish-list.component.scss'],
})
export class FriendWishListComponent implements OnInit {

  @Input() wishList: FriendWishList;

  image: Blob | null = null;
  loading = false;

  get date(): string {
    let dateString = NO_DATE_SELECTED;
    if (this.wishList.date) {
      dateString = this.datePipe.transform(this.wishList.date.toString());
    }
    return dateString;
  }

  get owners(): UserDto[] {
    return this.wishList?.owners ?? [];
  }

  get owner(): UserDto | null {
    return this.owners?.[0] ?? null;
  }

  get wishes(): FriendWish[] {
    return this.wishList?.wishes ?? [];
  }

  readonly wishComponentStyles: WishImageComponentStyles = {
    container: {
      display: 'flex',
      'justify-content': 'center',
      height: '100%'
    },
  }

  constructor(
    private readonly datePipe: DatePipe,
    private readonly userStore: UserProfileStore) { }

  ngOnInit(): void {
    if (this.owner.hasImage) {
      this.loading = true;
      this.userStore.downloadFriendImage(this.owner.email).pipe(
        first(),
        finalize(() => this.loading = false)
      ).subscribe(blob => {
        this.image = blob;
      })
    }
  }


}
