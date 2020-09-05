import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResultDataService } from '../shared/services/search-result-data.service';
import { SearchResultItem, SearchResultItemMapper } from '../shared/features/product-search/search-result-item';
import { ProductSearchService } from '../shared/services/product-search.service';
import { WishDto } from '../shared/models/wish-list.model';
import { NavController } from '@ionic/angular';
import { WishListService } from '../shared/services/wish-list.service';

@Component({
  selector: 'app-wish-search-results',
  templateUrl: './wish-search-results.page.html',
  styleUrls: ['./wish-search-results.page.scss'],
})
export class WishSearchResultsPage implements OnInit {

  results: SearchResultItem[] = [];

  searchByUrlForm: FormGroup;

  get url(): string {
    return this.searchByUrlForm.controls.url.value;
  }

  constructor(
    private productSearchService: ProductSearchService,     
    private formBuilder: FormBuilder, 
    private navController: NavController,
    private searchResultDataService: SearchResultDataService,
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.searchResultDataService.$lastSearchResults.subscribe( results => {
      console.log(results);
      this.results = results;
    }, console.error);

    this.searchResultDataService.$lastSearchTerm.subscribe( term => {
      this.createForm(term);
    }, console.error);
  }

  private createForm(value: String) {
    this.searchByUrlForm = this.formBuilder.group({
      url: value
    });
  }

  searchByUrl() {
    this.productSearchService.searchByUrl(this.url).then(searchResults => {
      this.results = searchResults;
      this.searchResultDataService.update(this.results);
      this.searchResultDataService.updateSearchTerm(this.url);
    }, console.error);
  }

  updateValue(item: SearchResultItem) {
    let wish = SearchResultItemMapper.map(item, new WishDto());
    this.wishListService.updateSelectedWish(wish);
    this.navController.navigateForward('secure/wish-search/wish-new');
  }


}
