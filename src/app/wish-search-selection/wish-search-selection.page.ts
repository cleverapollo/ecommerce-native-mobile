import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProductSearchService } from '@core/services/product-search.service';

@Component({
  selector: 'app-wish-search-selection',
  templateUrl: './wish-search-selection.page.html',
  styleUrls: ['./wish-search-selection.page.scss'],
})
export class WishSearchSelectionPage implements OnInit {
  
  searchByAmazonApiForm: FormGroup;
  keywords = new FormControl('');
  
  searchByUrlForm: FormGroup;
  url = new FormControl('https://www.otto.de/p/mcw-tv-rack-mcw-a27-t-2-staufaecher-mit-tuer-und-einlegeboden-in-3-positionen-S090801K/#variationId=S090801K4KU2');

  constructor(
    private productSearchService: ProductSearchService, 
    private formBuilder: FormBuilder,
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
      this.navController.navigateForward('secure/home/wish-search-selection/wish-search-results');
    }, console.error);
  }

}
