import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

  get canSkip(): boolean {
    return this.skipToPath ? true : false;
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

}
