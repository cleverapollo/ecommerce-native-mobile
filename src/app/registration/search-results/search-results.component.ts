import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { SearchResultItem } from '../services/search-result-item';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchResultsComponent),
      multi: true
    }
  ]
})
export class SearchResultsComponent implements OnInit, ControlValueAccessor {

  private onChange: Function = (wish: SearchResultItem) => {}
  private onTouch: Function = () => {}
  private disabled: boolean = false;

  @Input() wishes: Array<SearchResultItem> = new Array();
  @Output() onWishSelected = new EventEmitter<SearchResultItem>();

  constructor() { }

  ngOnInit() {
    console.log(this.wishes);
  }

  writeValue(value: SearchResultItem): void {
    this.onChange(value);
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {    
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(event: CustomEvent) {
    this.writeValue(event.detail.value);
    this.onTouch();
  }

}
