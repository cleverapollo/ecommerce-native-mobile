import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wish-list-partner',
  templateUrl: './wish-list-partner.component.html',
  styleUrls: ['./wish-list-partner.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WishListPartnerComponent),
      multi: true
    }
  ]
})
export class WishListPartnerComponent implements OnInit, ControlValueAccessor {

  private onChange: Function = (email: String) => {}
  private onTouch: Function = () => {}
  private disabled: boolean = false;

  constructor() { }

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
