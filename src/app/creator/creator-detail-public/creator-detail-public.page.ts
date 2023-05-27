import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { WanticError } from '@core/models/error.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { PlatformService } from '@core/services/platform.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-creator-detail-public',
  templateUrl: './creator-detail-public.page.html',
  styleUrls: ['./creator-detail-public.page.scss'],
})
export class CreatorDetailPublicPage implements OnInit, OnDestroy {

  userName: string;
  account: ContentCreatorAccount | null = null;
  errorMessage = '';
  isLoading = false;
  defaultHref: string | undefined = undefined;

  private subscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly analyticsService: AnalyticsService,
    private readonly creatorApi: ContentCreatorApiService,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.userName = this.route.snapshot.paramMap.get('userName');
    this.defaultHref = this.platformService.isWeb ? undefined : 'start';
    this._loadCreator();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_detail-public');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _loadCreator() {
    this.isLoading = true;
    this.subscription = this.creatorApi.getAccountByUserName(this.userName).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: account => {
        this.account = account;
      },
      error: error => {
        let message = `Beim Laden des Profils ist ein Fehler aufgetreten`;
        if (error instanceof WanticError) {
          if (error.httpStatusCode === 404) {
            message = `Das Profil mit dem Namen "${this.userName}" konnte nicht gefunden werden`;
          }
        }
        this.errorMessage = message;
      }
    });
  }

}
