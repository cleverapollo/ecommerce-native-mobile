import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { BrowserService } from '@core/services/browser.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';

import { WishDetailPage } from './wish-detail.page';

describe('WishDetailPage', () => {
  let component: WishDetailPage;
  let fixture: ComponentFixture<WishDetailPage>;

  let browserService: any = {
    openInAppBrowser(url: string): Promise<void> { return Promise.resolve(); }
  };
  let navController: any = {
    back() {}
  };
  let route = {
    snapshot: {
      data: {
        'wishList': WishListTestData.wishListBirthday,
        'wish': WishListTestData.wishBoschWasher
      }
    }
  };
  let wishListStore: any = {
    loadWish(wishListId: string, forceRefresh: boolean): Observable<WishDto> {
      return of(WishListTestData.wishBoschWasher)
    }
  };
  let analyticsService: any = {
    setFirebaseScreenName(event: string) {}
  };
  let affiliateLinkService: AffiliateService = {
    createAffiliateLink: function (productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link.de/product-id')
    },
    supportsDomain: function (domain: string): boolean {
      return true;
    }
  };
  let modalController: any = {
    create(opts): Promise<any> { return Promise.resolve(); }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishDetailPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: AffiliateLinkService, useValue: affiliateLinkService },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: WishListStoreService, useValue: wishListStore },
        { provide: NavController, useValue: navController },
        { provide: BrowserService, useValue: browserService },
        { provide: ModalController, useValue: modalController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
