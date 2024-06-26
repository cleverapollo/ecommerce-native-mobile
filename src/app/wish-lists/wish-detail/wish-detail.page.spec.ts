import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { BrowserService } from '@core/services/browser.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStore, WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule, ModalController, NavController } from '@ionic/angular';

import { DatePipe } from '@angular/common';
import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishShopInfoComponentFake } from '@test/components/wish-shop-info.component.mock';
import { of } from 'rxjs';
import { WishDetailPage } from './wish-detail.page';

describe('WishDetailPage', () => {

  let component: WishDetailPage;
  let fixture: ComponentFixture<WishDetailPage>;
  let router: Router

  const browserService: any = jasmine.createSpyObj('browserService', ['openInAppBrowser']);
  const navController = jasmine.createSpyObj('navController', ['back']);
  const route = {
    paramMap: of(convertToParamMap({
      wishListId: WishListTestData.wishListBirthday.id,
      wishId: WishListTestData.wishBoschWasher.id
    })),
    snapshot: new ActivatedRouteSnapshot()
  };
  const wishListStoreMock: WishListStore = new MockWishListStoreService([]);
  const analyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  const affiliateLinkService: AffiliateService = {
    createAffiliateLink(productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link.de/product-id')
    },
    supportsDomain(domain: string): boolean {
      return true;
    }
  };
  const modalController: any = {
    create(opts): Promise<any> { return Promise.resolve(); }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishDetailPage, NavToolbarComponentFake, WishImageComponentFake, EmailUnverifiedHintComponentFake, WishShopInfoComponentFake],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: AffiliateLinkService, useValue: affiliateLinkService },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: WishListStoreService, useValue: wishListStoreMock },
        { provide: NavController, useValue: navController },
        { provide: BrowserService, useValue: browserService },
        { provide: ModalController, useValue: modalController },
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(WishDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should send a analytics event', () => {
      component.ionViewDidEnter();
      expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('wishlist-wish');
    })
  });

  describe('openProductURL', () => {
    it('should open product url in browser', () => {
      component.openProductURL();
      expect(browserService.openInAppBrowser).toHaveBeenCalledWith('https://www.affiliate-link.de/product-id');
    })
  })

  describe('showDebugInfo', () => {

    it('should open an modal', fakeAsync(() => {
      const modalControllerSpy = spyOn(modalController, 'create').and.returnValue({ present: () => { return Promise.resolve(); } });

      component.showDebugInfo();
      tick();

      expect(modalControllerSpy).toHaveBeenCalled();
      flush();
    }));

  });
});
