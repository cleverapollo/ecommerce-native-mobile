import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProvider } from '@core/models/signup.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { SignupStateService } from '../signup/signup-state.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private analyticsService: AnalyticsService, 
    private signupStateService: SignupStateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('logon');
  }

  signupWithMailAndPassword() {
    this.signupStateService.$signupRequest.pipe(first()).subscribe(signupRequest => {
      signupRequest.authProvider = AuthProvider.wantic;
      this.signupStateService.updateState(signupRequest);
      this.router.navigateByUrl('/signup/signup-mail-one');
    })
  }

  signupWithApple() {

  }

  signupWithFacebook() {

  }

  signupWithGoogle() {

  }

}
