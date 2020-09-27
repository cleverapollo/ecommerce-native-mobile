import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { ProductSearchService } from '@core/services/product-search.service';
import { WishDto } from '@core/models/wish-list.model';
import { NavController } from '@ionic/angular';
import { WishListService } from '@core/services/wish-list.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-search-results',
  templateUrl: './wish-search-results.page.html',
  styleUrls: ['./wish-search-results.page.scss'],
})
export class WishSearchResultsPage implements OnInit, OnDestroy {

  private resultSubscription: Subscription;
  get results$(): Observable<SearchResultItem[]> {
    return this.searchResultDataService.$lastSearchResults;
  }
  
  private _results: SearchResultItem[] = [];

  set results(value) {
    this.loading = false;
    this._results = value;
  } 
  get results(): SearchResultItem[] {
    return this._results
  };

  loading: Boolean;
  searchByUrlForm: FormGroup;

  get url(): string {
    return this.searchByUrlForm.controls.url.value;
  }

  constructor(
    private productSearchService: ProductSearchService,     
    private formBuilder: FormBuilder, 
    private navController: NavController,
    private searchResultDataService: SearchResultDataService,
    private wishListService: WishListService,
    private changeDetection: ChangeDetectorRef
  ) { }


  ngOnDestroy(): void {
    this.resultSubscription.unsubscribe();
  }

  ngOnInit() {
    this.loading = true;
    this.searchResultDataService.$lastSearchTerm.subscribe( term => {
      this.createForm(term);
    }, console.error);

    this.resultSubscription = this.results$.subscribe({
      next: results => { this.results = results; this.changeDetection.detectChanges(); }
    })
  }

  private createForm(value: String) {
    this.searchByUrlForm = this.formBuilder.group({
      url: value
    });
  }

  searchByUrl() {
    this.productSearchService.searchByUrl(this.url).then(searchResults => {
    }, console.error);
  }

  updateValue(item: SearchResultItem) {
    let wish = SearchResultItemMapper.map(item, new WishDto());
    this.wishListService.updateSelectedWish(wish);
    this.navController.navigateForward('secure/wish-search/wish-new');
  }

}
