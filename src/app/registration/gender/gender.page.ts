import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationRequest } from '@core/models/registration.model';
import { Gender } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { RegistrationFormService } from '@registration/registration-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit, OnDestroy {

  gender?: Gender

  private registrationDto: RegistrationRequest;
  private formSubscription: Subscription;

  constructor(    
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('guided_onboarding-gender');
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto;
      this.gender = this.registrationDto?.user?.gender;
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  updateGender(event) {
    this.gender = event.target.value as Gender;
  }

  next() {
    this.formSubscription.unsubscribe();
    this.registrationDto.user.gender = this.gender;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../credentials'], { relativeTo: this.route })
  }

}
