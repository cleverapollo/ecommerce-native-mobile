import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailVerificationStatus } from '@core/models/user.model';
import { EmailVerificationService } from '@core/services/email-verification.service';
import { LogService } from '@core/services/log.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { IonTabs, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { getTaBarPath, TabBarRoute } from './tab-bar-routes';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.page.html',
  styleUrls: ['./tab-bar.page.scss'],
})
export class TabBarPage implements OnInit, OnDestroy {

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  private emailVerificationSubscription: Subscription;

  disableSearchTab: boolean = false;

  constructor(
    private navController: NavController, 
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private emailVerificationService: EmailVerificationService,
    private logger: LogService
  ) { }

  ngOnInit() {
    this.emailVerificationSubscription = this.emailVerificationService.emailVerificationStatus.subscribe({
      next: status => {
        this.disableSearchTab = status !== EmailVerificationStatus.VERIFIED;
      },
      error: this.logger.error
    })
  }

  ngOnDestroy() {
    this.emailVerificationSubscription.unsubscribe();
  }

  onTabButtonClicked() {
    const selectedTab = this.tabs.getSelected();
    if (this.router.url.includes(`secure/${selectedTab}/`)) {
      this.navController.navigateBack(`secure/${selectedTab}`);
    } else {
      this.navController.navigateRoot(`secure/${selectedTab}`);
    }
    if (selectedTab !== getTaBarPath(TabBarRoute.WISH_SEARCH, false)) {
      this.searchResultDataService.clear();
    }
  }

}
