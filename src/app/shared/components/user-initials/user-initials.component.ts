import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-initials',
  templateUrl: './user-initials.component.html',
  styleUrls: ['./user-initials.component.scss'],
})
export class UserInitialsComponent {

  @Input() firstName = '';
  @Input() lastName = '';
  @Input() size = 'size-s';

  constructor() { }

  get initials(): string {
    let initials = this.firstName?.charAt(0);
    if (this.lastName) {
      initials += `${this.lastName.charAt(0)}`;
    }
    return initials;
  }

}
