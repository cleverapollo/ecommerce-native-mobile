import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UrlTree } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {

  @Input() skipToPath?: string | any[] | UrlTree;
  @Input() defaultHref: string | undefined = undefined;
  @Input() showBackButton = true;
  @Input() logo = 'assets/icon/wantic-logo.svg';

  @Input() disableNextButton = false;
  @Output() nextButtonClick = new EventEmitter();

  get canSkip(): boolean {
    return this.skipToPath ? true : false;
  }

  get showNextButton(): boolean {
    return this.nextButtonClick?.observers.length > 0 || false;
  }

  constructor(
    private navigationService: NavigationService,
    private userService: UserProfileStore
  ) { }

  ngOnInit(): void {
    this.userService.isCreatorAccountActive$.subscribe(isActive => {
      this.logo = isActive ? 'assets/icon/wantic-logo-purple.svg' : 'assets/icon/wantic-logo.svg'
    })
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
