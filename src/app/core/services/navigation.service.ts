import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private navController: NavController) {
  }

  back(toPage?: string | any[] | UrlTree): Promise<boolean> {
    if (toPage) {
      return this.navController.navigateBack(toPage)
    }
    return new Promise((resolve, reject) => {
      this.navController.pop()
        .then(() => resolve(true))
        .catch(() => reject())
    });
  }

  forward(toPage: string | any[] | UrlTree): Promise<boolean> {
    return this.navController.navigateForward(toPage);
  }

  root(toPage: string | any[] | UrlTree): Promise<boolean> {
    return this.navController.navigateRoot(toPage);
  }

}
