import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResult } from '@core/models/search-result-item';
import { SearchService } from '@core/api/search.service';

@Injectable()
export class SearchResultsResolver implements Resolve<Observable<SearchResult>> {
  constructor(private searchService: SearchService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const keywords = route.queryParams.keywords;
    const page = route.queryParams.page;
    console.log(keywords, page);
    return this.searchService.searchForItems(keywords, page);
  }
}