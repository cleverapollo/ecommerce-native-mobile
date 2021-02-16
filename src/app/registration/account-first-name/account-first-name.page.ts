import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { RegistrationRequest } from '@core/models/registration.model';
import { Plugins } from '@capacitor/core';

const { Keyboard } = Plugins;
@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.page.html',
  styleUrls: ['./account-first-name.page.scss']
})
export class AccountFirstNamePage implements OnInit, OnDestroy {

  form: FormGroup;
  validationMessages: ValidationMessages = {
    firstName: [
      new ValidationMessage('required', 'Gib bitte deinen Namen an.')
    ]
  }

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService
  ) {}

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( dto => {
      this.registrationDto = dto;
      this.form = this.formBuilder.group({
        'firstName': this.formBuilder.control(this.registrationDto.user.firstName, [Validators.required])
      });
    });
  }

  ionViewWillLeave() {
    Keyboard.hide();
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.user.firstName = this.form.controls['firstName'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../birthday'], { relativeTo: this.route })
  }

  onKeyboardNextAction() {
    if (this.form.valid) {
      this.next();
    }
  }

}
