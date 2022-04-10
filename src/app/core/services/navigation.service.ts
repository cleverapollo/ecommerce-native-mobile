import { Injectable  } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private navController: NavController) { 
  }

  removeQueryParamFromCurrentRoute(queryParam: string) {
    let queryParams = {}
    queryParams[`${queryParam}`] = null
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
  }

  back(toPage?: string | any[] | UrlTree): Promise<boolean> {
    if (toPage) {
      return this.navController.navigateBack(toPage)
    }
    return new Promise((resolve, reject) => {
      this.navController.pop()
      .then(() => resolve(true))
      .catch(reject)
    });
  }

  forward(toPage: string | any[] | UrlTree): Promise<boolean> {
    return this.navController.navigateForward(toPage);
  }

}
