import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-initials',
  templateUrl: './user-initials.component.html',
  styleUrls: ['./user-initials.component.scss'],
})
export class UserInitialsComponent implements OnInit {

  @Input() firstName = '';

  @Input() lastName = '';

  constructor() { }

  ngOnInit() {}

  get initials(): String {
    let initials = this.firstName?.charAt(0);
    if (this.lastName) {
      initials += `${this.lastName.charAt(0)}`;
    }
    return initials;
  }

}
