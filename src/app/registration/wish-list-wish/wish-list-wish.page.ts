import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { IonSearchbar, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AnalyticsService } from '@core/services/analytics.service';

const { Keyboard } = Plugins;
@Component({
  selector: 'app-wish-list-wish',
  templateUrl: './wish-list-wish.page.html',
  styleUrls: ['./wish-list-wish.page.scss'],
})
export class WishListWishPage implements OnInit {

  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  form: FormGroup
  validationMessages: ValidationMessages = {
    keywords: [
      new ValidationMessage('required', 'Gib bitte einen Suchbegriff ein.'),
    ],
  }

  constructor(
    private router: Router, 
    private platform: Platform,
    private activatedRoute: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('guided_onboarding-wish');
    this.form = this.formBuilder.group({
      'keywords': this.formBuilder.control(null, [Validators.required])
    });
  }

  ionViewDidEnter() {
    this.searchBar.setFocus();
  }

  ionViewWillLeave() {
    if (this.platform.is('hybrid')) {
      Keyboard.hide();
    }
  }

  search() {
    this.router.navigate(['../search-results'], { 
      relativeTo: this.activatedRoute, 
      queryParams: { keywords: this.form.get('keywords').value, page: 1 } 
    });
  }

  onKeyboardNextAction() {
    if (this.form.valid) {
      this.search();
    }
  }

}
