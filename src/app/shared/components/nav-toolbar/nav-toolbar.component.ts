import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {

  @Input() skipToPath?: string | any[] | UrlTree;
  @Input() backNavigationPath?: string | any[] | UrlTree;
  @Input() showBackButton: boolean = true;

  @Input() disableNextButton: boolean = false;
  @Output() onNextButtonClicked = new EventEmitter();

  get canSkip(): boolean {
    return this.skipToPath ? true : false;
  }

  get showNextButton(): boolean {
    return this.onNextButtonClicked?.observers.length > 0 || false;
  }

  constructor(private navController: NavController) { }

  ngOnInit() { }

  goBack() {
    if (this.backNavigationPath) {
      this.navController.navigateBack(this.backNavigationPath);
    } else {
      this.navController.back();
    }
    this.showBackButton = false;
  }

  skip() {
    this.navController.navigateForward(this.skipToPath)
  }

  next() {
    this.onNextButtonClicked.emit();
  }

}
