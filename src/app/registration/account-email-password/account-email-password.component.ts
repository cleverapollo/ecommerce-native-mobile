import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.component.html',
  styleUrls: ['./account-email-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountEmailPasswordComponent),
      multi: true
    }
  ]
})
export class AccountEmailPasswordComponent implements OnInit, ControlValueAccessor {

  credentials: FormGroup

  private onChange: Function = (value: any) => {}
  private onTouch: Function = () => {}
  private disabled: boolean = false;

  private value : { email: String, password: String };

  constructor(private formBuilder: FormBuilder) { 
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {}

  writeValue(value: any): void {
    if (value) {
      this.credentials.setValue(value)
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.credentials.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: Function): void {    
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
