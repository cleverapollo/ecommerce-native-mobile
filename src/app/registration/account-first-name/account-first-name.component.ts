import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.component.html',
  styleUrls: ['./account-first-name.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountFirstNameComponent),
      multi: true
    }
  ]
})
export class AccountFirstNameComponent implements OnInit, ControlValueAccessor {

  private onChange: Function = (name: String) => {}
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
