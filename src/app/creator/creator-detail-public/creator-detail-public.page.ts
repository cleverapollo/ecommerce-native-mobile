import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { WanticError } from '@core/models/error.model';
import { ProductList } from '@core/models/product-list.model';
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

  productLists: ProductList[] = [];

  private subscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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

  getClass(listIndex: number) {
    return {
      'product-list-right': listIndex % 2 === 0,
      'product-list-left': listIndex % 2 === 1,
      'product-list-first': listIndex === 0
    }
  }

  selectProductList(productList: ProductList) {
    this.router.navigate([productList.name], {
      relativeTo: this.route
    });
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
        this.productLists = account.productLists;
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
