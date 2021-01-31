import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  private static MAX_ITEMS_PER_PAGE = 10;
  private static MAX_PAGES = 10;

  constructor() { }

  calcMaxPageCount(totalResultCount: number) {
    const pageCount = Math.ceil(totalResultCount / PagingService.MAX_ITEMS_PER_PAGE)
    return pageCount > PagingService.MAX_PAGES ? PagingService.MAX_PAGES : pageCount;
  }

}
