import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { RegistrationDto } from '../registration-form';

@Component({
  selector: 'app-wish-list-name',
  templateUrl: './wish-list-name.page.html',
  styleUrls: ['./wish-list-name.page.scss']
})
export class WishListNamePage implements OnInit, OnDestroy {

  form: FormGroup

  private registrationDto: RegistrationDto
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) {}

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      if (registrationDto) {
        this.registrationDto = registrationDto as RegistrationDto
      } else {
        this.formService.updateDto(new RegistrationDto());
      }
    });
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.wishListName = this.form.controls['name'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-date'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }

}
