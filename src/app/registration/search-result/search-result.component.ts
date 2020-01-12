import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchResultItem } from '../services/search-result-item';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  @Input() wish: SearchResultItem
  @Output() onSelectWish = new EventEmitter<SearchResultItem>();

  constructor() { }

  ngOnInit() {}

  selectWish() {
    this.onSelectWish.emit(this.wish);
  }

}
