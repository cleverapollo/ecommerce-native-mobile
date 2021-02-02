import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Gender, RegistrationDto } from '@registration/registration-form';
import { RegistrationFormService } from '@registration/registration-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.page.html',
  styleUrls: ['./gender.page.scss'],
})
export class GenderPage implements OnInit, OnDestroy {

  gender?: Gender

  private registrationDto: RegistrationDto;
  private formSubscription: Subscription;

  constructor(    
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService
  ) { }

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      this.registrationDto = registrationDto as RegistrationDto;
      this.gender = this.registrationDto?.userGender;
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
    this.registrationDto.userGender = this.gender;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../credentials'], { relativeTo: this.route })
  }

}
