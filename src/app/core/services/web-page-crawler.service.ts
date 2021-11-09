import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';
import { LogService } from './log.service';
import { SearchQuery, SearchResultDataService, SearchType } from './search-result-data.service';

@Injectable({
  providedIn: 'root'
})
export class WebPageCrawlerService {

  private result$: Observable<SearchResultItem[]>;
  private _result$: BehaviorSubject<SearchResultItem[]> = new BehaviorSubject([]);

  private browser: InAppBrowserObject;
  private url: string;
  private webCrawlerScriptContent: string = null;
  private webCrawlerScriptLoading: boolean = false;
  private inProgress = false;
  private busyIndicator: HTMLIonLoadingElement = null;

  constructor(
    private logger: LogService,
    private http: HttpClient,
    private inAppBrowser: InAppBrowser,
    private loadingService: LoadingService,
    private searchResultDataService: SearchResultDataService
  ) { 
    this._result$ =  new BehaviorSubject([]);
    this.result$ = this._result$.asObservable();
  }

  private async loadWebCrawlerScriptContent(): Promise<string> {
    if (this.webCrawlerScriptLoading) { return; }
    this.webCrawlerScriptLoading = true;
    const content = await this.http.get(`${window.location.origin}/assets/scripts/parse-imgs-from-website.js`, { responseType: 'text' }).toPromise();
    this.webCrawlerScriptLoading = false;
    this.webCrawlerScriptContent = content;
    return content;
  }

  search(url: string): Observable<SearchResultItem[]> {
    this.url = url;
    this.browser = this.inAppBrowser.create(url, '_blank', { location: 'no', clearcache: 'yes', toolbar: 'no', hidden: 'yes' });
    this.browser.on('loadstart')?.subscribe(event => {
      this.onLoadStart();
    }, this.handleGeneralError); 
    this.browser.on('exit')?.subscribe(event => {
      this.onBrowserExit();
    }, this.handleGeneralError);
    this.browser.on('loadstop')?.subscribe(event => {
      this.onLoadComplete(url)
    }, this.handleGeneralError);
    this.browser.on('loaderror')?.subscribe(event => {
      this.onLoadError();
    });
    this.browser.on('message')?.subscribe(event => {
      this.onMessageReceived(event);
    }, this.handleGeneralError);
    return this.result$;
  }

  private async onLoadComplete(url: string) {
    if (this.inProgress) { return; }
    this.inProgress = true;
    this.logger.log('loading finished ...');
    try {

      let code = this.webCrawlerScriptContent;
      if (code === null) {
        code = await this.loadWebCrawlerScriptContent();
      } 
      const results: [any] = await this.browser.executeScript({ code: code });
      this.logger.log('result ...', results);
      this.mapSearchResultArray(results, url);
      this.updateSearchQuery(this._result$.value);
    } catch (error) {
      this.stopBusyIndicator();
      this.handleGeneralError(error);
    }
    this.stopBusyIndicator();
    this.inProgress = false;
  }

  private updateSearchQuery(results: SearchResultItem[]) {
    const searchQuery = new SearchQuery();
    searchQuery.searchTerm = this.url;
    searchQuery.type = SearchType.URL;
    searchQuery.results = results;
    this.searchResultDataService.update(searchQuery);
  }

  private onLoadError() {
    this.logger.log('loading error');
    this.stopBusyIndicator();
  }

  private async onLoadStart() {
    this.logger.log('start loading ...');
    await this.startBusyIndicator();
  }

  private onBrowserExit() {
    this.logger.log('exit browser ...');
    this.stopBusyIndicator();
  }

  private onMessageReceived(event: InAppBrowserEvent) {
    this.logger.log('message recieved ...', event);
    if (typeof event.data === 'string') {
      this.logger.log(event.data);
    } else if (typeof event.data === 'object') {
      const item = event.data;
      this.mapSearchResultItem(item);
    }
  }

  private handleGeneralError(error) {
    this.logger.log('general error ...', error);
    this.stopBusyIndicator();
  }

  private mapSearchResultArray(results: any[], url: string) {
    results.forEach(result => {
      this.mapSearchResultItem(result, url);
    });
  }

  private mapSearchResultItem(result: any, url?: string) {
    if (result !== null && typeof result === 'object' && result.hasOwnProperty('name') && result.hasOwnProperty('imageUrl')) {
      const item = new SearchResultItem(result.asin, result.name, result.imageUrl, result.productUrl ? result.productUrl : url, result.price, result.id);
      this.addItem(item);
    } else if (Array.isArray(result)) {
      this.mapSearchResultArray(result as any[], url);
    }
  }

  private async startBusyIndicator() {
    if (!this.busyIndicator) {
      this.busyIndicator = await this.loadingService.createLoadingSpinner();
      await this.busyIndicator.present();
    }
  }

  private async stopBusyIndicator() {
    if (this.busyIndicator) {
      await this.loadingService.dismissLoadingSpinner(this.busyIndicator);
      this.busyIndicator = null;
    }
  }

  private addItem(item: SearchResultItem) {
    const items = this._result$.value;
    if (!items.some(i => i.id === item.id)) {
      this._result$.value.push(item);
      this._result$.next(this._result$.value);
      this.updateSearchQuery(this._result$.value);
    }
  }

  closeInAppBrowser() {
    this._result$.next([]);
    if (this.browser) {
      this.browser.close();
    }
  }


}
