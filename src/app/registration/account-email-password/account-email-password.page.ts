import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { AuthService } from '@core/api/auth.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { RegistrationRequest, RegistrationResponse } from '@core/models/registration.model';
import { LoadingService } from '@core/services/loading.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { IonInput } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { first } from 'rxjs/operators';
import { StorageKeys, StorageService } from '@core/services/storage.service';

const { Keyboard } = Plugins;
@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.page.html',
  styleUrls: ['./account-email-password.page.scss']
})
export class AccountEmailPasswordPage implements OnInit, OnDestroy {

  @ViewChildren(IonInput) inputs: Array<IonInput>;

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ],
    passwordValue: [
      new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
      new ValidationMessage('minlength', 'Kurze Passwörter sind leicht zu erraten. Verwende ein Passwort mit mindestens 7 Zeichen.'),
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
      new ValidationMessage('passwordDoesNotMatch', 'Die Passwörter stimmen nicht überein.'),
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
    private loadingService: LoadingService,
    private storageService: StorageService,
    public privacyPolicyService: PrivacyPolicyService) { 
  }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      this.form = this.formBuilder.group({
        email: [this.registrationDto.user.email, { 
          validators: [Validators.required, CustomValidation.email], 
          updateOn: 'blur' 
        }],
        password: this.formBuilder.group({
          value: [null, { validators: Validators.compose([
            Validators.required,
            CustomValidation.passwordValidator({ passwordTooWeak: true }),
            Validators.minLength(8)
          ]), updateOn: 'blur' }
          ],
          confirm: [null, { 
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }]
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
    this.authApiService.register(this.registrationDto).pipe(first()).subscribe({
      next: response => {
        this.authService.saveToken(response.jwToken.token).then(() => {
          this.storageService.set(StorageKeys.REGISTRATION_RESPONSE, response).then(() => {
            this.router.navigate(['../registration-complete'], { relativeTo: this.route });
          });
        })
      },
      complete: () => {
        this.loadingService.dismissLoadingSpinner();
      }
    })
  }

 handleKeyboardEventOnEmailInput(keyCode: number) {
  if (keyCode == 13) {
    this.inputs.find((input) => { 
      return input.name === 'password';
     }).setFocus();
  }
 }

 handleKeyboardEventOnPasswordInput(keyCode: number) {
  if (keyCode == 13) {
    this.inputs.find((input) => { 
      return input.name === 'passwordConfirm';
     }).setFocus();
  }
 }

 handleKeyboardEventOnPasswordConfirmInput(keyCode: number) {
   if (keyCode == 13) {
    Keyboard.hide();
   }
 }
  
}
