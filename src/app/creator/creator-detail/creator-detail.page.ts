import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { CreatorService } from '@core/services/creator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creator-detail',
  templateUrl: './creator-detail.page.html',
  styleUrls: ['./creator-detail.page.scss'],
})
export class CreatorDetailPage implements OnInit, OnDestroy {

  account: ContentCreatorAccount;

  private subscription: Subscription;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly creatorService: CreatorService
  ) { }

  ngOnInit() {
    this.subscription = this.creatorService.selectedCreator$.subscribe(creator => this.account = creator);
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_detail');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
