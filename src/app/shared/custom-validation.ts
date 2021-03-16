import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidation {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
  
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
  
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordValidator(error: ValidationErrors) : ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const hasNumber = /\d/.test(control.value);
        const hasCapitalCase = /[A-Z]/.test(control.value);
        const hasSmallCase = /[a-z]/.test(control.value);
        const isValid = hasNumber && hasCapitalCase && hasSmallCase;
    
        return isValid ? null : error;
      };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('value').value; // get password from our password form control
    const confirmPassword: string = control.get('confirm').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirm').setErrors({ passwordDoesNotMatch: true });
    }
  }

  static email(control: AbstractControl): ValidationErrors | null {
    if (control.value?.length > 0) {
      const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const validEmailAdress = emailRegex.test(control.value);
      return validEmailAdress ? null : { email: control.value };
    }
    return null;
  }

  static valueHasChanged(control: AbstractControl): ValidationErrors | null { 
    return control.dirty ? null : {
      valueHasNotChanged: true
    }
  }


  static validateFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);   
      if (control instanceof FormGroup) { 
        this.validateFormGroup(control);
      }
      control.markAsTouched({ onlySelf: true });      
    });
  }

}