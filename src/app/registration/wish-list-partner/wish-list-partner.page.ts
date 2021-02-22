import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { UserApiService } from '@core/api/user-api.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { RegistrationRequest } from '@core/models/registration.model';

@Component({
  selector: 'app-wish-list-partner',
  templateUrl: './wish-list-partner.page.html',
  styleUrls: ['./wish-list-partner.page.scss']
})
export class WishListPartnerPage implements OnInit, OnDestroy {

  form: FormGroup
  validationMessages: ValidationMessages = {
    name: [
      new ValidationMessage('required', 'Gib bitte den Namen deines Partners an.'),
      new ValidationMessage('minlength', 'Der Name deines Partners muss aus mindestens zwei Zeichen bestehen.')
    ],
    email: [
      new ValidationMessage('required', 'Gib bitte die E-Mail Adresse deines Partners an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ]
  }

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) { }

  ngOnInit() {
    /*this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      // const invitePartnerRequest = registrationDto.invitePartnerRequest;
      this.form = this.formBuilder.group({
        'email': this.formBuilder.control(invitePartnerRequest?.email, [CustomValidation.email, Validators.required]),
        'name': this.formBuilder.control(invitePartnerRequest?.name, [Validators.minLength(2), Validators.required])
      });
    });*/
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }
  
/*
  next() {
    this.registrationDto.invitePartnerRequest = {
      email: this.form.controls['email'].value,
      name: this.form.controls['name'].value
    };
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }*/
}
