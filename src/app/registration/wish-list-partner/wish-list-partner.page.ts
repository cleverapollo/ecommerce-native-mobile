import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationDto } from '../registration-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';

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
      this.registrationDto = registrationDto
    });
    this.form = this.formBuilder.group({
      'partner': this.formBuilder.control('', [Validators.email])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.wishListPartnerEmail = this.form.controls['partner'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-wish'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }

}
