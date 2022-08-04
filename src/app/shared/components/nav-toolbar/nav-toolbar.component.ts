import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UrlTree } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent {

  @Input() skipToPath?: string | any[] | UrlTree;
  @Input() backNavigationPath?: string | any[] | UrlTree;
  @Input() showBackButton = true;

  @Input() disableNextButton = false;
  @Output() nextButtonClick = new EventEmitter();

  get canSkip(): boolean {
    return this.skipToPath ? true : false;
  }

  get showNextButton(): boolean {
    return this.nextButtonClick?.observers.length > 0 || false;
  }

  constructor(private navigationService: NavigationService) { }

  goBack() {
    this.navigationService.back(this.backNavigationPath);
    this.showBackButton = false;
  }

  skip() {
    if (this.canSkip) {
      this.navigationService.forward(this.skipToPath);
    }
  }

  next() {
    this.nextButtonClick.emit();
  }

}
