import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserApiService } from '@core/api/user-api.service';
import { Gender } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-signup-mail-two',
  templateUrl: './signup-mail-two.page.html',
  styleUrls: ['./signup-mail-two.page.scss'],
})
export class SignupMailTwoPage implements OnInit {

  birthday?: Date;
  gender?: Gender;

  form: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private logger: Logger,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private userApiService: UserApiService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('signup-gender-birthday');
  }

  /**
   * Update event of the gender radio element.
   * @param event onChange event of the element.
   */
  updateGender(event) {
    this.gender = event.target.value as Gender;
  }

  /**
   * Updates entered values by user and navigates to the next page.
   * @returns Default Promise from an async method.
   */
  async next(): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    await this.saveGenderIfNeeded();
    await this.saveBirthdayIfNeeded();
    await this.navigateToNextPage();
    await this.loadingService.stopLoadingSpinner();
  }

  /**
   * Navigates either to the last signup page or directly to the dashboard.
   * This depends on the email verfication state.
   *
   * @returns Default Promise from an async method.
   */
  private async navigateToNextPage(): Promise<void> {
    if (this.authService.isEmailVerified.value) {
      await this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
    } else {
      await this.router.navigateByUrl('/signup/signup-completed');
    }
  }

  /**
   * Save value for birthday if it was entered by user.
   *
   * @returns Default Promise from an async method.
   */
  private async saveBirthdayIfNeeded(): Promise<void> {
    const birthdayFormControl = this.form.controls.date;
    this.logger.info('birthday', birthdayFormControl.value);
    this.logger.info('form', this.form.controls);
    if (birthdayFormControl.value && birthdayFormControl.valid) {
      const birthday = birthdayFormControl.value;
      try {
        await this.userApiService.partialUpdateBirthday(birthday).toPromise();
        return Promise.resolve();
      } catch (error) {
        this.logger.error(error);
        this.toastService.presentErrorToast('Beim Speichern deines Geburtstags ist ein Fehler aufgetreten.');
      }
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Save value for gender if it was entered by user.
   *
   * @returns Default Promise from an async method.
   */
  private async saveGenderIfNeeded(): Promise<void> {
    this.logger.info('gender', this.gender);
    if (this.gender) {
      try {
        await this.userApiService.partialUpdateGender(this.gender).toPromise();
      } catch (error) {
        this.logger.error(error);
        this.toastService.presentErrorToast('Beim Speichern deines Geschlechts ist ein Fehler aufgetreten.');
      }
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Setup the form for this page.
   * Form includes just the birthday field.
   * Gender is handled seperatly.
   */
  private setupForm() {
    let birthday = '';
    if (this.birthday) {
      birthday = this.birthday.toISOString();
    }
    this.form = this.formBuilder.group({
      date: this.formBuilder.control(birthday)
    });
  }
}
