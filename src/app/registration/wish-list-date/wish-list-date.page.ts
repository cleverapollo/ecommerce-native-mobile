import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { RegistrationRequest } from '@core/models/registration.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list-date',
  templateUrl: './wish-list-date.page.html',
  styleUrls: ['./wish-list-date.page.scss']
})
export class WishListDatePage implements OnInit, OnDestroy {

  form: FormGroup
  validationMessages = {
    date: [
      { type: 'required', message: 'Gib bitte ein Datum an, an welches deine Wunschliste gebunden ist.' }
    ]
  }

  get minDate(): number { return new Date().getFullYear(); } 
  get maxDate(): number { return this.minDate + 10; }

  private registrationDto: RegistrationRequest;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initForm() {
    this.subscription = this.formService.form$.subscribe({
      next: requestModel => {
        this.registrationDto = requestModel;
        let value = '';
        if (this.registrationDto?.wishList.date) {
          value = this.registrationDto.wishList.date.toDateString();
        }
        this.createForm(value);
      },
      error: error => {
        this.createForm('');
      }
    })
  }

  private createForm(dateString: string) {
    this.form = this.formBuilder.group({
      'date': this.formBuilder.control(dateString, [Validators.required])
    });
  }

  next() {
    this.subscription.unsubscribe();
    this.formService.date = this.form.controls['date'].value;
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }

  onKeyboardNextAction() {
    if (this.form.valid) {
      this.next();
    }
  }

}
