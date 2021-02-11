import { Component, ContentChild, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, RequiredValidator, ValidationErrors } from '@angular/forms';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShowHidePasswordComponent),
      multi: true
    }
  ]
})
export class ShowHidePasswordComponent implements OnInit, ControlValueAccessor {

  @ViewChild(IonInput) input: IonInput;

  @Input()
  initialValue: string;

  _password: string;

  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
    this.propagateChange(this._password);
  }

  showPassword = false;

  propagateChange = (_: any) => {};
  onTouched: any = (_: any) => { };

  constructor() { }

  ngOnInit() {}

  toggleShow() {
    console.log('toggle');
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  writeValue(password: string): void {
    this.password = password;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
  }

}
