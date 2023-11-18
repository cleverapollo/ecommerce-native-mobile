import { Component, Input, OnInit } from '@angular/core';
import { EmailDto, EmailVerificationStatus, UserDto, UserWishListDto } from '@core/models/user.model';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-owners-info',
  templateUrl: './owners-info.component.html',
  styleUrls: ['./owners-info.component.scss'],
})
export class OwnersInfoComponent implements OnInit {

  @Input() owners: Array<UserDto | UserWishListDto> = [];
  @Input() showOnlyInitials = false;

  images = {};

  get wishListOwnerCount(): number {
    return this.owners.length;
  }

  cssClass(first: boolean, last: boolean) {
    return {
      standalone: this.wishListOwnerCount === 1,
      first: this.wishListOwnerCount > 1 && first,
      last: this.wishListOwnerCount > 1 && last
    }
  }

  constructor(private userStore: UserProfileStore) { }

  ngOnInit(): void {
    this.owners.forEach(owner => {
      const email = typeof owner.email === 'string' ? owner.email : owner.email.value;
      this.images[email] = {};
      if (owner.hasImage) {
        this.images[email].loading = true;
        this.userStore.downloadFriendImage({ value: email, status: EmailVerificationStatus.VERIFIED }).pipe(
          first(),
          finalize(() => this.images[email].loading = false)
        ).subscribe(blob => {
          this.images[email].blob = blob;
        })
      } else {
        this.images[email].loading = false;
      }
    })
  }

  getEmail(email: string | EmailDto) {
    return typeof email === 'string' ? email : email.value;
  }

}
