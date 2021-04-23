import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonInput } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { Plugins } from '@capacitor/core';
import { SignupRequest } from '@core/models/signup.model';
import { SignupStateService } from '../../signup-state.service';
import { first } from 'rxjs/operators';
import { LogService } from '@core/services/log.service';

const { Keyboard } = Plugins;

@Component({
  selector: 'app-signup-mail-one',
  templateUrl: './signup-mail-one.page.html',
  styleUrls: ['./signup-mail-one.page.scss'],
})
export class SignupMailOnePage implements OnInit {

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
    private logger: LogService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('signup-mail-1');
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
      lastName: this.formBuilder.control(signupRequest?.lastName ?? null),
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
      this.updateSignupRequest();
    } else {
      CustomValidation.validateFormGroup(this.form);
    }
  }

  private updateSignupRequest() {
    this.signupRequest.firstName = this.getFormControlValue('firstName');
    this.signupRequest.lastName = this.getFormControlValue('lastName');
    this.signupRequest.email = this.getFormControlValue('email');
    this.signupRequest.password = this.getFormControlValue('value', 'password');
    this.signupStateService.updateState(this.signupRequest);
  }

  private getFormControlValue(formControlName: string, formGroupName?: string) {
    const formControls = this.form.controls;
    if (formGroupName) {
      return formControls[formGroupName][formControlName].value;
    }
    return formControls[formControlName].value;
  }


  // Keyboard event handling

  handleKeyboardEventOnFirstNameInput(keyCode: number) {
    this.setFocusToNextInputFieldOnEnter(keyCode, 'lastName');
   }

   handleKeyboardEventOnLastNameInput(keyCode: number) {
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
