import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SearchResult, SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegistrationFormService } from '../registration-form.service';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { WishDto } from '@core/models/wish-list.model';
import { SearchService } from '@core/api/search.service';
import { PagingService } from '@core/services/paging.service';
import { LogService } from '@core/services/log.service';
import { RegistrationRequest } from '@core/models/registration.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss']
})
export class SearchResultsPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  keywords: string;
  page: number = 1;
  maxPageCount: number = 1;
  searchResult: SearchResult;
  searchResultItems: Array<SearchResultItem> = [];

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formService: RegistrationFormService,
    private searchService: SearchService,
    private pagingService: PagingService,
    private logger: LogService) {}

  ngOnInit() {
    this.searchResult = this.route.snapshot.data.searchResult;
    this.searchResultItems = this.searchResult.items;
    this.maxPageCount = this.pagingService.calcMaxPageCount(this.searchResult.totalResultCount); 
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
    });
    this.route.queryParamMap.subscribe(paramMap => {
      this.page = Number(paramMap.get('page')) ?? 1;
      this.keywords = paramMap.get('keywords') ?? '';

      if (this.page === this.maxPageCount && this.infiniteScroll) {
        // disable infinite scroll
        this.infiniteScroll.disabled = true;
      }
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  updateValue(item: SearchResultItem) {
    this.registrationDto.wishList.wish = SearchResultItemMapper.map(item, new WishDto());
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../first-name'], { relativeTo: this.route });
  }

  loadMoreSearchResults(event) {
    this.page++;
    this.searchService.searchForItems(this.keywords, this.page).subscribe({
      next: searchResult => {
        this.searchResultItems = this.searchResultItems.concat(searchResult.items);
        this.maxPageCount = this.pagingService.calcMaxPageCount(searchResult.totalResultCount);
        if (this.page === this.maxPageCount) {
          // disable infinite scroll
          event.target.disabled = true;
        }
      },
      error: error => {
        this.logger.error(error);
        this.page--;
      },
      complete: () => {
        event.target.complete();
      }
    });
  }

}
