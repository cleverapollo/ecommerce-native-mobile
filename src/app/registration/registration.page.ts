import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationStep } from './registration-step';
import { RegistrationForm } from './registration-form';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  private registrationStates: RegistrationStep[] = [
    new RegistrationStep('introduction'),
    new RegistrationStep('wishListName'),
    new RegistrationStep('wishListDate')
  ]

  activeStep: RegistrationStep;
  registrationForm: FormGroup ;

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.activeStep = this.registrationStates[0];

  }

  nextStep() {
    if (this.activeStep.id == 'introduction') {
      this.activeStep = this.registrationStates[1]
    } else if (this.activeStep.id == 'wishListName') {
      this.activeStep = this.registrationStates[2]
    }
  }

  onSubmit() {}

  get buttonDisabled() : boolean  {
    if (this.activeStep.id == 'wishListName') { 
      const form = this.registrationForm.value as RegistrationForm;
      return form.name.length == 0;
    } else if (this.activeStep.id == 'wishListDate') {
      const form = this.registrationForm.value as RegistrationForm;
      return !form.date;
    } else {
      return false;
    }
  }

}
