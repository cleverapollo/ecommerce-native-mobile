import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationDto } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { UserApiService } from 'src/app/shared/services/user-api.service';

@Component({
  selector: 'app-wish-list-partner',
  templateUrl: './wish-list-partner.page.html',
  styleUrls: ['./wish-list-partner.page.scss']
})
export class WishListPartnerPage implements OnInit, OnDestroy {

  form: FormGroup

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
      this.registrationDto = registrationDto as RegistrationDto
    });
    this.form = this.formBuilder.group({
      'email': this.formBuilder.control(this.registrationDto.wishListPartnerEmail, [Validators.email]),
      'name': this.formBuilder.control(this.registrationDto.wishListPartnerName, [Validators.min(2)])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.wishListPartnerEmail = this.form.controls['email'].value;
    this.registrationDto.wishListPartnerName = this.form.controls['name'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })

    this.form.controls['email'].setValidators([Validators.email, Validators.required]);
    this.form.controls['email'].updateValueAndValidity()
    this.form.controls['name'].setValidators([Validators.min(2), Validators.required]);
    this.form.controls['name'].updateValueAndValidity()
  }

  goBack() {
    this.navController.back();
  }

}
