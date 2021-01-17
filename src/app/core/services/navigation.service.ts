import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  removeQueryParamFromCurrentRoute(queryParam: string) {
    let queryParams = {}
    queryParams[`${queryParam}`] = null
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
  }

}
