import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { RegistrationDto } from '../registration-form';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.page.html',
  styleUrls: ['./account-first-name.page.scss']
})
export class AccountFirstNamePage implements OnInit, OnDestroy {

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
    this.formSubscription = this.formService.form$.subscribe( form => {
      this.registrationDto = form
    });
    this.form = this.formBuilder.group({
      'firstName': this.formBuilder.control('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.userFirstName = this.form.controls['firstName'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../credentials'], { relativeTo: this.route })
  }

  goBack() {
    this.navController.back();
  }

}
