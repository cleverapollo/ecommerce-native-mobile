import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationForm } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { RegistrationService } from '../services/registration.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.page.html',
  styleUrls: ['./account-email-password.page.scss']
})
export class AccountEmailPasswordPage implements OnInit, OnDestroy {

  form: FormGroup

  private currentForm: RegistrationForm
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private registrationApiService: RegistrationService,
    private navController: NavController) { 
  }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.currentForm = form
    });
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.currentForm.accountInfos.email = this.form.controls['email'].value;
    this.currentForm.accountInfos.password = this.form.controls['password'].value;
    this.formService.updateForm(this.currentForm);

    this.registrationApiService.register(this.currentForm)
      .then(() => {
        this.router.navigate(['../registration-complete'], { relativeTo: this.route })
      })
      .catch((e => console.error(e)));
  }

  goBack() {
    this.navController.back();
  }

}
