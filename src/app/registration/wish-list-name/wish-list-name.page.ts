import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationFormService } from '../registration-form.service';
import { Subscription } from 'rxjs';
import { RegistrationRequest } from '@core/models/registration.model';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Keyboard } = Plugins;

@Component({
  selector: 'app-wish-list-name',
  templateUrl: './wish-list-name.page.html',
  styleUrls: ['./wish-list-name.page.scss']
})
export class WishListNamePage implements OnInit, OnDestroy {

  form: FormGroup

  validationMessages = {
    name: [
      { type: 'required', message: 'Gib bitte einen Namen für deine Wunschliste an.' }
    ]
  }

  private registrationDto: RegistrationRequest
  private formSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute,
    private formService: RegistrationFormService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.formSubscription = this.formService.form$.subscribe( registrationDto => {
      if (registrationDto) {
        this.registrationDto = registrationDto;
      } else {
        this.registrationDto = new RegistrationRequest();
        this.formService.updateDto(this.registrationDto);
      }

      let value = '';
      if (this.registrationDto?.wishList?.name) {
        value = this.registrationDto.wishList.name;
      }
      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(value, [Validators.required])
      });
    });

  }

  ionViewWillLeave() {
    if (this.platform.is('hybrid')) {
      Keyboard.hide();
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  next() {
    this.registrationDto.wishList.name = this.form.controls['name'].value;
    this.formService.updateDto(this.registrationDto);
    this.router.navigate(['../wish-list-date'], { relativeTo: this.route })
  }

  onKeyboardNextAction() {
    if (this.form.valid) {
      this.next();
    }
  }

}
