import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/api/auth.service';
import { UserApiService } from '@core/api/user-api.service';
import { Gender } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { ToastService } from '@core/services/toast.service';
import { first } from 'rxjs/operators';
import { SignupStateService } from '../../signup-state.service';

@Component({
  selector: 'app-signup-mail-two',
  templateUrl: './signup-mail-two.page.html',
  styleUrls: ['./signup-mail-two.page.scss'],
})
export class SignupMailTwoPage implements OnInit, OnDestroy {

  birthday?: Date;
  gender?: Gender;
  agreedToPrivacyPolicyAt?: Date;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private logger: LogService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private userApiService: UserApiService,
    public privacyPolicyService: PrivacyPolicyService
  ) { 
    this.analyticsService.setFirebaseScreenName('signup-gender-birthday');
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy(): void {}

  private createForm() {
    let value = '';
    if (this.birthday) {
      value = this.birthday.toDateString();
    }
    this.form = this.formBuilder.group({
      date: this.formBuilder.control(value, {
        updateOn: 'blur'
      })
    });
  }

  updateGender(event) {
    this.gender = event.target.value as Gender;
  }

  async next() {
    const loadingSpinner = await this.loadingService.createLoadingSpinner();
    loadingSpinner.present();

    if (this.gender) {
      this.userApiService.partialUpdateGender(this.gender).pipe(first()).subscribe({
        error: error => {
          this.logger.error(error);
          this.toastService.presentErrorToast('Beim Speichern deines Geschlechts ist ein Fehler aufgetreten.');
        }
      })
    }

    const birthdayFormControl = this.form.controls.date;
    if (birthdayFormControl.valid) {
      this.userApiService.partialUpdateBirthday(birthdayFormControl.value).pipe(first()).subscribe({
        error: error => {
          this.logger.error(error);
          this.toastService.presentErrorToast('Beim Speichern deines Geburtstags ist ein Fehler aufgetreten.');
        }
      })
    }

    await this.router.navigateByUrl('/signup/signup-completed');
    this.loadingService.dismissLoadingSpinner(loadingSpinner);
  }

}
