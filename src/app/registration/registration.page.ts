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
    new RegistrationStep('wishListDate'),
    new RegistrationStep('wishListPartner'),
    new RegistrationStep('wishListWish')
  ]

  activeStep: RegistrationStep;
  registrationForm: FormGroup;
  searchKeyword: String;

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      partner: ['', Validators.email],
      wishes: this.formBuilder.array([ 
        this.formBuilder.group({
          name: '',
          price: '',
          imageUrl: '',
          productUrl: ''
        }) 
      ], [Validators.required, Validators.min(1)])
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
    } else if (this.activeStep.id == 'wishListDate') {
      this.activeStep = this.registrationStates[3]
    } else if (this.activeStep.id == 'wishListPartner') {
      this.activeStep = this.registrationStates[4]
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
    } else if (this.activeStep.id == 'wishListPartner') {
      const form = this.registrationForm.value as RegistrationForm;
      return !form.partner;
    } else if (this.activeStep.id == 'wishListWish') {
      return !this.searchKeyword;
    }else {
      return false;
    }
  }

  getUpdatedSearchKeyword(keyword: String) {
    this.searchKeyword = keyword;
  }

}
