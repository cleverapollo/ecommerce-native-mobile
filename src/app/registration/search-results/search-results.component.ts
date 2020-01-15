import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { SearchResultItem } from '../services/search-result-item';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  selectedWish: SearchResultItem;
  wishes: Array<SearchResultItem> = new Array();

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.wishes = this.route.snapshot.data.products;
  }

  updateValue(item: SearchResultItem) {
    this.selectedWish = item;
  }

  next() {
    this.router.navigate(['../first-name'], { relativeTo: this.route });
  }

}
