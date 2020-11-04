import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from '@core/models/user.model';

@Component({
  selector: 'app-owners-info',
  templateUrl: './owners-info.component.html',
  styleUrls: ['./owners-info.component.scss'],
})
export class OwnersInfoComponent implements OnInit {

  @Input()
  owners: Array<UserDto> = new Array<UserDto>();

  get wishListOwnerCount(): number {
    return this.owners.length;
  }

  cssClass(first: boolean, last: boolean) {
    return {
      'standalone': this.wishListOwnerCount == 1,
      'first': this.wishListOwnerCount > 1 && first,
      'last': this.wishListOwnerCount > 1 && last
    }
  }

  constructor() { }

  ngOnInit() {}

}
