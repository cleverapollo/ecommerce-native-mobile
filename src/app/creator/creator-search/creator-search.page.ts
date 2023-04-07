import { Component, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { CreatorService } from '@core/services/creator.service';
import { PagingService } from '@core/services/paging.service';
import { InfiniteScrollCustomEvent, IonInfiniteScroll } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-creator-search',
  templateUrl: './creator-search.page.html',
  styleUrls: ['./creator-search.page.scss'],
})
export class CreatorSearchPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  searchField: FormControl = new FormControl(null);
  searchResult: ContentCreatorAccount[] = [];
  displayResult: ContentCreatorAccount[] = [];
  isSearching = false;
  page = 1;
  maxPageCount = 1;

  trackByUserName: TrackByFunction<ContentCreatorAccount> = (idx, creator) => creator.userName;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly pagingService: PagingService,
    private readonly creatorApiService: ContentCreatorApiService,
    private readonly creatorService: CreatorService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searchField.valueChanges.subscribe({
      next: searchTerm => {
        if (searchTerm) {
          this.search(searchTerm);
        } else if (this.displayResult.length) {
          this._resetResult();
        }
      },
    })
    this.creatorService.setSelectedCreator(null);
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search_creators');
  }

  search(searchTerm: string) {
    this.isSearching = true;
    this.displayResult = [];
    this.analyticsService.logSearchEvent(searchTerm);
    this.creatorApiService.searchForAccounts(searchTerm).pipe(
      finalize(() => this.isSearching = false)
    ).subscribe({
      next: result => {
        this.searchResult = result;
        this.page = 1;
        this.maxPageCount = this.pagingService.calcMaxPageCount(result.length);

        const end = result.length > PagingService.MAX_ITEMS_PER_PAGE ?
          PagingService.MAX_ITEMS_PER_PAGE :
          result.length;
        this._updateDisplayResult(0, end);
      }
    })
  }

  reset() {
    this.searchField.reset();
    this._resetResult();
  }

  loadMoreSearchResults(event: Event) {
    const infiniteScrollEvent = event as InfiniteScrollCustomEvent
    this.page++;
    if (this.page === this.maxPageCount) {
      this.displayResult = this.searchResult;
      infiniteScrollEvent.target.disabled = true;
    } else {
      const start = this.page * PagingService.MAX_ITEMS_PER_PAGE - 1;
      this._updateDisplayResult(start, start + PagingService.MAX_ITEMS_PER_PAGE);
    }
    infiniteScrollEvent.target.complete();
  }

  selectItem(creator: ContentCreatorAccount) {
    this.analyticsService.logSelectItemEvent(creator.userName, 'Content Creators');
    this.creatorService.setSelectedCreator(creator);
    console.log(creator);
    this.router.navigate(['creator-detail'], { relativeTo: this.route });
  }

  private _resetResult() {
    this.searchResult = [];
    this.displayResult = [];
    this.page = 1;
    this.maxPageCount = 1;
  }

  private _updateDisplayResult(start: number, end: number) {
    this.displayResult = this.displayResult.concat(
      this.searchResult.slice(start, end)
    )
  }

}
