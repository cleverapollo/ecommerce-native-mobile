import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {

  @Input() skipToPath: string | any[] | UrlTree;
  
  canGoBack: boolean = false;
  canSkip: boolean = false;

  constructor(private navController: NavController, private router: Router) { }

  ngOnInit() {
    this.canSkip = this.skipToPath ? true : false;
    this.router.events.pipe(
      filter( e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.canGoBack = e.url !== '/secure/home/wish-list-overview';
    })
  }

  goBack() {
    this.navController.back();
  }

  skip() {
    this.navController.navigateForward(this.skipToPath)
  }

}
