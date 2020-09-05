import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserEventType } from '@ionic-native/in-app-browser/ngx';
import { isString, isArray, isObject } from 'util';
import { SearchResultItem } from '../features/product-search/search-result-item';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  private searchResults: SearchResultItem[] = [];

  constructor(private inAppBrowser: InAppBrowser, private loadingService: LoadingService) { }

  searchByUrl(url: string): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
      const browser = this.inAppBrowser.create(url, '_blank', { location: 'no', clearcache: 'yes', toolbar: 'no', hidden: 'yes' });
      browser.on('loadstart').subscribe(event => {
        console.log('start loading ...');
        this.loadingService.showLoadingSpinner();
      });
      browser.on('exit').subscribe(event => {
        console.log('exit browser ...');
        this.loadingService.dismissLoadingSpinner();
      });
      browser.on('loadstop').subscribe(event => {
        console.log('loading finished ...');
        browser.executeScript({ code: this.scriptGetImageUrlsFromWebsite }).then((results: [{ name: String, imageUrl: string }]) => {
          console.log(results);
          this.mapSearchResultArray(results, url);
          console.log('after mapping', this.searchResults);
          resolve(this.searchResults);
          browser.close()
        });
      });
      browser.on('loaderror').subscribe(event => {
        console.log('loading error');
        reject();
        this.loadingService.dismissLoadingSpinner();
      });
    });
  }

  private get scriptGetImageUrlsFromWebsite(): string {
    return  'let imgs = document.getElementsByTagName(\'img\');'+
            'let imgArray = Array.from(imgs);' +
            'imgArray.map(x => { if (x.src) { return { name: x.alt, imageUrl: x.src };  } else if(x.srcset) { return { name: x.alt, imageUrl: x.srcset.split(\',\')[0] }; } return { name: \'\', imageUrl: \'\'  };  }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith(\'http\'));'
  }

  private mapSearchResultArray(results: [any], url: string) {
    results.forEach(result => {
      if (isObject(result) && result.hasOwnProperty('name') && result.hasOwnProperty('imageUrl')) {
        this.searchResults.push(new SearchResultItem(result.name, result.imageUrl, url));
      } else if (isArray(result)) {
        this.mapSearchResultArray(result as [any], url);
      }
    });
  }

  /*private createSearchResultsFromResult(items: [{ name: String, imageUrl: string }], url: string) {
    items.forEach(item => {
      if (isString(item) && item.startsWith('http')) {
        let searchResultItem = new SearchResultItem();
        searchResultItem.imageUrl = item;
        searchResultItem.name = "";
        searchResultItem.price = "";
        searchResultItem.productUrl = url;
        this.searchResults.push(searchResultItem);
      } else if (isArray(item)) {
        this.createSearchResultsFromResult(item as [any], url);
      }
    });
  }*/

}
