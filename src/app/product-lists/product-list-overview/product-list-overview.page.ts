import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Subscription, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-overview',
  templateUrl: './product-list-overview.page.html',
  styleUrls: ['./product-list-overview.page.scss'],
})
export class ProductListOverviewPage implements OnInit, OnDestroy {

  account: ContentCreatorAccount | null = null;
  image: Blob | null = null;
  isLoading = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private userStore: UserProfileStore,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.subscription.add(this._setupData());
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_overview');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async forceRefresh(event: Event): Promise<void> {
    const target = event.target as HTMLIonRefresherElement;
    this.isLoading = true;
    await this.userStore.loadUserProfile(true).toPromise();
    target.complete();
  }

  private _setupData(): Subscription {
    const user$ = this.userStore.user$.pipe(filter((user): user is UserProfile => !!user));
    return combineLatest([user$, this.userStore.creatorImage$]).pipe(
      map(result => ({ account: result[0].creatorAccount, image: result[1] }))
    ).subscribe({
      next: data => {
        this.account = data.account;
        this.image = data.image;
        this.isLoading = false;
      },
      error: _ => {
        this.isLoading = false;
      }
    })
  }

}
