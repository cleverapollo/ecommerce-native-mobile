import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResultItem } from '@core/models/search-result-item';
import { SearchService } from '@core/api/search.service';

@Injectable()
export class SearchResultsResolver implements Resolve<Observable<Array<SearchResultItem>>> {
  constructor(private searchService: SearchService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const keywords = route.queryParams.keywords;
    return this.searchService.searchForItems(keywords);
  }
}