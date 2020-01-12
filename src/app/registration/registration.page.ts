import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationStep } from './registration-step';
import { RegistrationForm } from './registration-form';
import { SearchService } from './services/search.service';
import { SearchResultItem } from './services/search-result-item';

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
    new RegistrationStep('wishListWish'),
    new RegistrationStep('searchResults'),
    new RegistrationStep('firstName'),
    new RegistrationStep('emailPassword'),
    new RegistrationStep('registrationCompleted'),
  ]

  activeStep: RegistrationStep;
  registrationForm: FormGroup;
  searchKeyword: String;
  searchResult: Array<SearchResultItem> = new Array();

  constructor(private formBuilder: FormBuilder, private searchService: SearchService) {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      partner: ['', Validators.email],
      wishes: '',
      accountInfos: this.formBuilder.group({
        firstName: ['', Validators.required],
        credentials: '',
      })
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
    } else if (this.activeStep.id == 'wishListWish') {
      this.searchService.searchForItems(this.searchKeyword).subscribe({
        next: (wishes) => {
          this.searchResult = wishes;
          this.activeStep = this.registrationStates[5]
        },
        error: e => console.error(e)
      });
    } else if (this.activeStep.id == 'searchResults') {
      this.activeStep = this.registrationStates[6]
    } else if (this.activeStep.id == 'firstName') {
      this.activeStep = this.registrationStates[7]
    } else if (this.activeStep.id == 'emailPassword') {
      this.activeStep = this.registrationStates[8]
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
    } else if (this.activeStep.id == 'searchResults') {
      const form = this.registrationForm.value as RegistrationForm;
      return !form.wishes;
    } else if (this.activeStep.id == 'firstName') {
      const form = this.registrationForm.value as RegistrationForm;
      return !form.accountInfos || !form.accountInfos.firstName;
    } else if (this.activeStep.id == 'emailPassword') {
      const form = this.registrationForm.value as RegistrationForm;
      return !form.accountInfos || 
        !form.accountInfos.credentials || 
        !form.accountInfos.credentials.email || 
        !form.accountInfos.credentials.password;
    } else {
      return false;
    }
  }

  getUpdatedSearchKeyword(keyword: String) {
    this.searchKeyword = keyword;
  }

}
