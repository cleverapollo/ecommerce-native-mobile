import { Injectable  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  back(): Promise<void> {
    return this.navController.pop();
  }

}
