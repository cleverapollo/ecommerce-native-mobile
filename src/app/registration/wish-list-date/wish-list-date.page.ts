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
      'date': this.formBuilder.control(this.registrationDto.wishListDate, [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.wishListDate = this.form.controls['date'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-partner'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }


}
