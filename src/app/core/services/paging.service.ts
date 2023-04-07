import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  static MAX_ITEMS_PER_PAGE = 10;
  static MAX_PAGES = 10;

  calcMaxPageCount(totalResultCount: number) {
    const pageCount = Math.ceil(totalResultCount / PagingService.MAX_ITEMS_PER_PAGE)
    return pageCount > PagingService.MAX_PAGES ? PagingService.MAX_PAGES : pageCount;
  }

}
