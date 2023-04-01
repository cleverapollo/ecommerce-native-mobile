import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule, NavController } from '@ionic/angular';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';

import { WishListOverviewPage } from './wish-list-overview.page';

@Component({ template: '' })
class DummyComponent { }

@Component({ selector: 'app-email-unverified-hint', template: '' })
class EmailUnverifiedHintComponentFake { }

describe('WishListOverviewPage', () => {
  let component: WishListOverviewPage;
  let fixture: ComponentFixture<WishListOverviewPage>;

  const wishListBirthday = WishListTestData.wishListBirthday;
  const wishListStoreFake = new MockWishListStoreService([wishListBirthday]);
  const navControllerSpy: jasmine.SpyObj<NavController> = jasmine.createSpyObj('navController', ['navigateForward']);
  const analyticsServiceSpy: jasmine.SpyObj<AnalyticsService> = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  const affiliateDataStoreSpy: jasmine.SpyObj<AffiliateDataStoreService> = jasmine.createSpyObj('affiliateDataStore', ['affiliateProgrammes', 'loadData']);
  const loadingServiceSpy: jasmine.SpyObj<LoadingService> = jasmine.createSpyObj('loadingService', ['showLoadingSpinner', 'stopLoadingSpinner']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WishListOverviewPage,
        EmailUnverifiedHintComponentFake,
        NavToolbarComponentFake
      ],
      providers: [
        { provide: WishListStoreService, useValue: wishListStoreFake },
        { provide: NavController, useValue: navControllerSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
        { provide: AffiliateDataStoreService, useValue: affiliateDataStoreSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'secure/home/wish-list-new', component: DummyComponent },
          { path: 'secure/wish-search', component: DummyComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bootstraps wish lists', waitForAsync(() => {
    expect(component.wishLists.length).toBe(1);
    expect(component.wishLists).toEqual([wishListBirthday]);
    expect(loadingServiceSpy.showLoadingSpinner).toHaveBeenCalled();
    expect(loadingServiceSpy.stopLoadingSpinner).toHaveBeenCalled();
  }));

  it('listens to wish list updates', () => {
    expect(component['subscription']).toBeDefined();
  });

  describe('ionViewWillEnter', () => {

    beforeEach(() => {
      affiliateDataStoreSpy.loadData.calls.reset();
    });

    it('loads affiliate programmes if data is empty', () => {
      (affiliateDataStoreSpy.affiliateProgrammes as any) = [];
      component.ionViewWillEnter();
      expect(affiliateDataStoreSpy.loadData).toHaveBeenCalledTimes(1);
    });

    it('avoids multiple affiliate backend calls', () => {
      (affiliateDataStoreSpy.affiliateProgrammes as any) = [new AffiliateProgramme()];
      component.ionViewWillEnter();
      expect(affiliateDataStoreSpy.loadData).toHaveBeenCalledTimes(0);
    });

  })

  describe('ionViewDidEnter', () => {

    beforeEach(() => {
      component.ionViewDidEnter();
    });

    it('sends a analytics event', () => {
      expect(analyticsServiceSpy.setFirebaseScreenName).toHaveBeenCalledWith('main');
    });

  });

  describe('selectWishList', () => {

    it('navigates to the right wish list', () => {
      let wishList = WishListTestData.wishListBirthday;
      component.selectWishList(wishList);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('secure/home/wish-list/1');

      wishList = WishListTestData.wishListWedding;
      component.selectWishList(wishList);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('secure/home/wish-list/2')
    })

  });

});
