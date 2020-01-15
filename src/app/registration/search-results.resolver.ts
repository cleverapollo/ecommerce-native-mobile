import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResultItem } from './services/search-result-item';
import { SearchService } from './services/search.service';

@Injectable()
export class SearchResultsResolver implements Resolve<Observable<Array<SearchResultItem>>> {
  constructor(private searchService: SearchService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.searchService.searchForItems(route.paramMap.get('keywords'));
  }
}