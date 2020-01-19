import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.page.html',
  styleUrls: ['./account-first-name.page.scss']
})
export class AccountFirstNamePage implements OnInit, OnDestroy {

  form: FormGroup

  private currentForm: RegistrationForm
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService) {}

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.currentForm = form
    });
    this.form = this.formBuilder.group({
      'firstName': this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.currentForm.accountInfos.firstName = this.form.controls['firstName'].value;
    this.formService.updateForm(this.currentForm);
    this.router.navigate(['../credentials'], { relativeTo: this.route })
  }

}
