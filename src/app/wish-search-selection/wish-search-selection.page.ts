import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SearchResultDataService } from '../shared/services/search-result-data.service';
import { NavController } from '@ionic/angular';
import { ProductSearchService } from '../shared/services/product-search.service';

@Component({
  selector: 'app-wish-search-selection',
  templateUrl: './wish-search-selection.page.html',
  styleUrls: ['./wish-search-selection.page.scss'],
})
export class WishSearchSelectionPage implements OnInit {
  
  searchByAmazonApiForm: FormGroup;
  keywords = new FormControl('');
  
  searchByUrlForm: FormGroup;
  url = new FormControl('https://www.zalando.de/nike-performance-boutique-bra-skins-sport-bh-n1241i08r-j11.html');

  constructor(
    private productSearchService: ProductSearchService, 
    private formBuilder: FormBuilder, 
    private searchResultDataService: SearchResultDataService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.searchByAmazonApiForm = this.formBuilder.group({
      keywords: this.keywords
    });
    this.searchByUrlForm = this.formBuilder.group({
      url: this.url
    });
  }

  searchByAmazonApi() {}

  searchByUrl() {
    this.productSearchService.searchByUrl(this.url.value).then(searchResults => {
      this.searchResultDataService.updateSearchTerm(this.url.value);
      this.searchResultDataService.update(searchResults);
      this.navController.navigateForward('secure/home/wish-search-selection/wish-search-results');
    }, console.error);
  }

}
