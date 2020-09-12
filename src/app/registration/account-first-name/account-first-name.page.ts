import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { NavController } from '@ionic/angular';
import { RegistrationDto, RegistrationRequest, RegistrationPartnerDto } from '../registration-form';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/components/validation-messages/validation-message';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.page.html',
  styleUrls: ['./account-first-name.page.scss']
})
export class AccountFirstNamePage implements OnInit, OnDestroy {

  form: FormGroup
  pageViewViaEmail: Boolean;
  validationMessages: ValidationMessages = {
    firstName: [
      new ValidationMessage('required', 'Gib bitte deinen Namen an.')
    ]
  }

  // only when invited by mail available
  userId: String = null;
  inviterName: String = null;
  wishListName: String = null;

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private navController: NavController) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.pageViewViaEmail = true;
        this.userId = params['id'];
        this.inviterName = params['invitedBy'];
        this.wishListName = params['wishListName'];
      };
    })

    this.formSubscription = this.formService.form$.subscribe( dto => {
      this.registrationDto = dto;
      this.form = this.formBuilder.group({
        'firstName': this.formBuilder.control(this.registrationDto.userFirstName, [Validators.required])
      });
    });

  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    if (this.userId) {
      this.registrationDto = new RegistrationPartnerDto();
      (this.registrationDto as RegistrationPartnerDto).userId = this.userId;
    }
    this.registrationDto.userFirstName = this.form.controls['firstName'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../credentials'], { relativeTo: this.route })
  }

}
