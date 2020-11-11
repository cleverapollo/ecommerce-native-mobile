import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationDto } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { UserApiService } from '@core/api/user-api.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';

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
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ]
  }

  private registrationDto: RegistrationDto;
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) { }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = (registrationDto as RegistrationDto);
      const invitePartnerRequest = (registrationDto as RegistrationDto).invitePartnerRequest;
      this.form = this.formBuilder.group({
        'email': this.formBuilder.control(invitePartnerRequest?.email, [Validators.email, Validators.required]),
        'name': this.formBuilder.control(invitePartnerRequest?.name, [Validators.minLength(2), Validators.required])
      });
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.invitePartnerRequest = {
      email: this.form.controls['email'].value,
      name: this.form.controls['name'].value
    };
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }
}
