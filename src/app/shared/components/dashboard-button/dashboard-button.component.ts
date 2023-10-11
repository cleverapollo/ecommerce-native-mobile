import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-button',
  templateUrl: './dashboard-button.component.html',
  styleUrls: ['./dashboard-button.component.scss'],
})
export class DashboardButtonComponent {

  @Input() icon = 'plus';

  get iconSrc(): string {
    return `assets/icon/${this.icon}.svg`
  }

}
