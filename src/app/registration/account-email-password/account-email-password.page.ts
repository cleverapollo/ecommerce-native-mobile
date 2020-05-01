import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { RegistrationService } from '../services/registration.service';
import { NavController } from '@ionic/angular';
import { RegistrationDto, RegistrationRequest, RegistrationPartnerDto } from '../registration-form';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { CustomValidation } from 'src/app/shared/custom-validation';

@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.page.html',
  styleUrls: ['./account-email-password.page.scss']
})
export class AccountEmailPasswordPage implements OnInit, OnDestroy {

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ],
    password: [
      new ValidationMessage('passwordDoesNotMatch', 'Die Passwört stimmen nicht überein.'),
    ],
    passwordValue: [
      new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
      new ValidationMessage('minlength', 'Kurze Passwörter sind leicht zu erraten. Verwende ein Passwort mit mindestens 7 Zeichen.'),
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen () enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
    ]
  }


  private registrationDto: RegistrationRequest
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private registrationApiService: RegistrationService,
    private navController: NavController,
    private authService: AuthenticationService) { 
  }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      this.form = this.formBuilder.group({
        email: [this.registrationDto.userEmail, [Validators.required, Validators.email]],
        password: this.formBuilder.group({
          value: [null, Validators.compose([
            Validators.required,
            CustomValidation.passwordValidator({ passwordTooWeak: true }),
            Validators.minLength(8)
          ])
          ],
          confirm: [null, Validators.compose([Validators.required])]
        }, { 
          validator: CustomValidation.passwordMatchValidator
        })
      })
    });
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
      .then((response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['../registration-complete'], { relativeTo: this.route });
      })
      .catch((e => console.error(e)));
    }
  }

  goBack() {
    this.navController.back();
  }


}
