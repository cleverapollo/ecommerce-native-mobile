import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResult } from '@core/models/search-result-item';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';

@Injectable()
export class SearchResultsResolver implements Resolve<Observable<SearchResult>> {
  constructor(private searchService: PublicResourceApiService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const keywords = route.queryParams.keywords;
    const page = route.queryParams.page;
    return this.searchService.searchForItems(keywords, page);
  }
}