import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {

  @Input() skipToPath: string | any[] | UrlTree;
  @Input() rootPath: string | any[] | UrlTree;

  get canGoBack(): boolean {
    return (this.rootPath && this.router.url !== this.rootPath) || this.routerOutlet.canGoBack();
  };
  
  get canSkip(): boolean {
    return this.skipToPath ? true : false;
  }

  constructor(private navController: NavController, private router: Router, private routerOutlet: IonRouterOutlet) { }

  ngOnInit() { }

  goBack() {
    this.navController.back();
  }

  skip() {
    this.navController.navigateForward(this.skipToPath)
  }

}
