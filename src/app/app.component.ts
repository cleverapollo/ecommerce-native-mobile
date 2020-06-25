import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Startseite',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Profil bearbeiten',
      url: 'profile-edit',
      icon: 'build'
    },
    {
      title: 'AGB',
      url: '/list',
      icon: 'book'
    },
    {
      title: 'Datenschutz',
      url: '/list',
      icon: 'lock'
    },
    {
      title: 'Impressum',
      url: '/list',
      icon: 'paper'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authenticationService.logout().then(() => {
      this.menuController.toggle();
      this.router.navigate(['start']);
    })
  }
}
