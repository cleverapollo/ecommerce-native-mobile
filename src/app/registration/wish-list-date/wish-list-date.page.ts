import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationDto } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';

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
      this.registrationDto = registrationDto as RegistrationDto;
      
      let value = '';
      if (this.registrationDto && this.registrationDto.wishListDate) {
        value = this.registrationDto.wishListDate.toDateString();
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
    this.registrationDto.wishListDate = this.form.controls['date'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-partner'], { relativeTo: this.route })
  }

}
