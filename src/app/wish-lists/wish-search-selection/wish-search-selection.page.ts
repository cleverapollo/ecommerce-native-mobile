import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ProductSearchService } from '@core/services/product-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { Platform } from '@ionic/angular';
import { LoadingService } from '@core/services/loading.service';

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
    private router: Router,
    private route: ActivatedRoute,
    private logger: LogService,
    public platform: Platform,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.searchByAmazonApiForm = this.formBuilder.group({
      keywords: this.keywords
    });
    this.searchByUrlForm = this.formBuilder.group({
      url: this.url
    });
  }

  searchByAmazonApi() {
    this.loadingService.showLoadingSpinner();
    this.productSearchService.searchByAmazonApi(this.keywords.value, 1).then(searchResults => {
      this.navigateToSearchResultPage();
    }, this.logger.error).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

  searchByUrl() {
    this.productSearchService.searchByUrl(this.url.value).then(searchResults => {
      this.navigateToSearchResultPage();
    }, this.logger.error);
  }

  private navigateToSearchResultPage() {
    this.router.navigate(['wish-search-results'], { relativeTo: this.route });
  }

}
