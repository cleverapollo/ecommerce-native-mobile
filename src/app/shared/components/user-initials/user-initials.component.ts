import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-initials',
  templateUrl: './user-initials.component.html',
  styleUrls: ['./user-initials.component.scss'],
})
export class UserInitialsComponent implements OnChanges {

  @Input() firstName = '';
  @Input() lastName = '';
  @Input() size = 'size-s';
  @Input() showSwitchImage = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showSwitchImage.currentValue !== this.showSwitchImage) {
      this.showSwitchImage = changes.showSwitchImage.currentValue;
    }
  }

  get cssClass(): string {
    const bgColor = this.showSwitchImage ? ' background-color-dark' : ''
    return this.size + bgColor;
  }

  get initials(): string {
    let initials = this.firstName?.charAt(0);
    if (this.lastName) {
      initials += `${this.lastName.charAt(0)}`;
    }
    return initials;
  }

}
