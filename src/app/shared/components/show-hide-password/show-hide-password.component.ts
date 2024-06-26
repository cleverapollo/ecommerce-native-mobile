import { Component, ContentChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class ShowHidePasswordComponent implements ControlValueAccessor {

  @ContentChild(IonInput) input: IonInput;

  _password: string;

  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
    this.propagateChange(this._password);
  }

  showPassword = false;

  propagateChange = (_: any) => { };
  onTouched: any = (_: any) => { };

  toggleShow() {
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
