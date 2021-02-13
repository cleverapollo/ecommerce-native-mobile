import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { AuthService } from '@core/api/auth.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { RegistrationRequest } from '@core/models/registration.model';
import { LoadingService } from '@core/services/loading.service';

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
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
    ]
  }

  private registrationDto: RegistrationRequest
  private formSubscription: Subscription;

  get acceptPrivacyPolicy(): boolean {
    return this.form?.controls['acceptPrivacyPolicy']?.value ?? false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private authApiService: AuthService,
    private authService: AuthenticationService,
    private loadingService: LoadingService) { 
  }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      this.form = this.formBuilder.group({
        email: [this.registrationDto.user.email, [Validators.required, CustomValidation.email]],
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
        }),
        acceptPrivacyPolicy: this.formBuilder.control(false, [Validators.requiredTrue])
      })
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.user.email = this.form.controls['email'].value;
    this.registrationDto.user.password = this.form.controls['password']['value'].value;
    this.registrationDto.agreedToPrivacyPolicyAt = new Date();
    this.formService.updateDto(this.registrationDto);

    this.loadingService.showLoadingSpinner();
    this.authApiService.register(this.registrationDto).subscribe({
      next: response => {
        this.authService.saveToken(response.token);
        this.router.navigate(['../registration-complete'], { relativeTo: this.route });
        this.loadingService.dismissLoadingSpinner();
      }
    })
  }
  
}
