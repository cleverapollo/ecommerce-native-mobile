import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wish-list-date',
  templateUrl: './wish-list-date.component.html',
  styleUrls: ['./wish-list-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WishListDateComponent),
      multi: true
    }
  ]
})
export class WishListDateComponent implements OnInit, ControlValueAccessor {

  private onChange: Function = (date: Date) => {}
  private onTouch: Function = () => {}
  private disabled: boolean = false;

  constructor() { }

  ngOnInit() {}

  writeValue(value: Date): void {
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
    const date = new Date(event.detail.value)
    this.writeValue(date);
    this.onTouch();
  }

}
