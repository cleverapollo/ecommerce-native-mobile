import { Component, OnInit, Output, Input, EventEmitter, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wish-list-name',
  templateUrl: './wish-list-name.component.html',
  styleUrls: ['./wish-list-name.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WishListNameComponent),
      multi: true
    }
  ]
})
export class WishListNameComponent implements OnInit, ControlValueAccessor {

  private onChange: Function = (name: String) => {}
  private onTouch: Function = () => {}
  private disabled: boolean = false;

  constructor() {}

  ngOnInit() {}

  writeValue(value: String): void {
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
