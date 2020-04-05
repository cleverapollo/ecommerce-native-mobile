import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { RegistrationService } from '../services/registration.service';
import { NavController } from '@ionic/angular';
import { RegistrationDto, RegistrationRequest, RegistrationPartnerDto } from '../registration-form';

@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.page.html',
  styleUrls: ['./account-email-password.page.scss']
})
export class AccountEmailPasswordPage implements OnInit, OnDestroy {

  form: FormGroup

  private registrationDto: RegistrationRequest
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
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto
    });
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: this.formBuilder.group({
        value: ['', [Validators.required]],
        confirm: ['', [Validators.required]]
      }, { validators: [this.passwordConformValidator] })
    })
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.userEmail = this.form.controls['email'].value;
    this.registrationDto.userPassword = this.form.controls['password']['value'].value;
    this.formService.updateDto(this.registrationDto);

    if ((this.registrationDto as RegistrationPartnerDto).userId) {
      this.registrationApiService.registerPartner(this.registrationDto as RegistrationPartnerDto).then(() => {
        this.router.navigate(['../registration-complete'], { relativeTo: this.route })
      })
      .catch((e => console.error(e)));
    } else {
      this.registrationApiService.register(this.registrationDto as RegistrationDto)
      .then(() => {
        this.router.navigate(['../registration-complete'], { relativeTo: this.route })
      })
      .catch((e => console.error(e)));
    }
  }

  goBack() {
    this.navController.back();
  }

  private passwordConformValidator(c: AbstractControl): { invalid: boolean } {
    if (c.get('value').value !== c.get('confirm').value) {
      return { invalid: true };
    }
  }

}
