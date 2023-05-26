import { Component, OnInit } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

@Component({
  selector: 'app-product-list-overview',
  templateUrl: './product-list-overview.page.html',
  styleUrls: ['./product-list-overview.page.scss'],
})
export class ProductListOverviewPage implements OnInit {

  account: ContentCreatorAccount | null = null;
  isLoading = false;

  constructor(
    private readonly userProfileStore: UserProfileStore,
    private readonly analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this._loadCreatorAccount();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_overview');
  }

  async forceRefresh(event: Event) {
    const target = event.target as HTMLIonRefresherElement;
    this.isLoading = true;
    await this._loadCreatorAccount(true);
    target.complete();
  }

  private async _loadCreatorAccount(forceRefresh: boolean = false) {
    try {
      const userProfile = await this.userProfileStore.loadUserProfile(forceRefresh).toPromise();
      this.account = userProfile.creatorAccount || null;
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

}
