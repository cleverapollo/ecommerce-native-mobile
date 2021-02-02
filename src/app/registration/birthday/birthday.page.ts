import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RegistrationDto } from '@registration/registration-form';
import { RegistrationFormService } from '@registration/registration-form.service';
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
      { type: 'required', message: 'Gib bitte dein Geburtsdatum ein.' }
    ]
  }

  get maxDate(): number { return new Date().getFullYear(); } 

  private registrationDto: RegistrationDto;
  private formSubscription: Subscription;

  constructor(    
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService
  ) { }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto as RegistrationDto;
      
      let value = '';
      if (this.registrationDto?.userBirthday) {
        value = this.registrationDto.userBirthday.toDateString();
      }

      this.form = this.formBuilder.group({
        'date': this.formBuilder.control(value, [Validators.required])
      });
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.formSubscription.unsubscribe();
    this.registrationDto.userBirthday = this.form.controls['date'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../gender'], { relativeTo: this.route })
  }

}
