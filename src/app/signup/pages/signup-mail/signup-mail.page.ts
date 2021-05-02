import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequest } from '@core/models/signup.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LogService } from '@core/services/log.service';
import { IonInput } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { SignupStateService } from '../../signup-state.service';

import { Plugins } from '@capacitor/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
const { Keyboard } = Plugins;

@Component({
  selector: 'app-signup-mail',
  templateUrl: './signup-mail.page.html',
  styleUrls: ['./signup-mail.page.scss'],
})
export class SignupMailPage implements OnInit {

  @ViewChildren(IonInput) inputs: Array<IonInput>;

  form: FormGroup;
  signupRequest: SignupRequest;
  validationMessages: ValidationMessages = {
    firstName: [
      new ValidationMessage('required', 'Gib bitte deinen Namen an.')
    ],
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ],
    passwordValue: [
      new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
      new ValidationMessage('minlength', 'Kurze Passwörter sind leicht zu erraten. Verwende ein Passwort mit mindestens 7 Zeichen.'),
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben und einen Kleinbuchstaben enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
      new ValidationMessage('passwordDoesNotMatch', 'Die Passwörter stimmen nicht überein.'),
    ],
  }

  constructor(
    private formBuilder: FormBuilder,
    private analyticsService: AnalyticsService,
    private signupStateService: SignupStateService,
    private logger: LogService,
    private router: Router,
    private authService: AuthenticationService,
    private loadingService: LoadingService,
  ) { 
    this.analyticsService.setFirebaseScreenName('signup-mail');
  }

  ngOnInit() {
    this.signupStateService.$signupRequest.subscribe(signupRequest => {
      this.signupRequest = signupRequest
      this.createForm(signupRequest)
    }, errorReason => {
      this.logger.debug('failed to load signup request from cache. ', errorReason);
      this.createForm();
    });
  }

  private createForm(signupRequest?: SignupRequest) {
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(signupRequest?.firstName ?? null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      email: [signupRequest?.email ?? null, { 
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
      })
    });
  }

  next() {
    if (this.form.valid) { 
      this.signup();
    } else {
      CustomValidation.validateFormGroup(this.form);
    }
  }

  async signup() {
    const loadingSpinner = await this.loadingService.createLoadingSpinner();
    loadingSpinner.present();
    this.authService.signupWithFirebaseEmailAndPassword(this.signupRequest).then(() => {
      this.router.navigateByUrl('signup/signup-completed');
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner(loadingSpinner);
    })
  }
  // Keyboard event handling

  handleKeyboardEventOnFirstNameInput(keyCode: number) {
    this.setFocusToNextInputFieldOnEnter(keyCode, 'email');
   }

  handleKeyboardEventOnEmailInput(keyCode: number) {
    this.setFocusToNextInputFieldOnEnter(keyCode, 'password');
   }
  
   handleKeyboardEventOnPasswordInput(keyCode: number) {
    this.setFocusToNextInputFieldOnEnter(keyCode, 'passwordConfirm');
   }

   private setFocusToNextInputFieldOnEnter(keyCode: number, inputName: string) {
    if (keyCode == 13) { 
      this.inputs.find((input) => {
        return input.name === inputName;
      }).setFocus();
    }    
  }
  
   handleKeyboardEventOnPasswordConfirmInput(keyCode: number) {
     if (keyCode == 13) {
      Keyboard.hide();
     }
   }
}
