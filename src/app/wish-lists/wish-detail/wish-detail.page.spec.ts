import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
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

  let browserService: any = jasmine.createSpyObj('browserService', ['openInAppBrowser']);  
  let navController = jasmine.createSpyObj('navController', ['back']);
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
  let analyticsService = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
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
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

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

  describe('ionViewWillEnter', () => {
    it('should load wish data', () => {
      const wishListStoreSpy = spyOn(wishListStore, 'loadWish').and.returnValue(of());
      component.ionViewWillEnter();
      expect(wishListStoreSpy).toHaveBeenCalledWith('1');
    });
  })

  describe('goBack', () => {
    it('should navigate back', () => {
      component.goBack();
      expect(navController.back).toHaveBeenCalled();
    });
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
