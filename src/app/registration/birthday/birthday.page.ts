import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationRequest } from '@core/models/registration.model';
import { RegistrationFormService } from '@registration/registration-form.service';
import { CustomValidation } from '@shared/custom-validation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.page.html',
  styleUrls: ['./birthday.page.scss'],
})
export class BirthdayPage implements OnInit {

  form: FormGroup
  validationMessages = {
    date: [
      { type: 'required', message: 'Gib bitte dein Geburtsdatum ein oder überspringe diesen Schritt.' }
    ]
  }

  get maxDate(): number { return new Date().getFullYear(); } 

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(    
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService
  ) { }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      
      let value = '';
      if (this.registrationDto?.user?.birthday) {
        value = this.registrationDto.user.birthday.toDateString();
      }

      this.form = this.formBuilder.group({
        'date': this.formBuilder.control(value, {
          validators: [Validators.required],
          updateOn: 'submit'
        })
      });
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return
    }
    this.formSubscription.unsubscribe();
    this.registrationDto.user.birthday = this.form.controls['date'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../gender'], { relativeTo: this.route })
  }

}
