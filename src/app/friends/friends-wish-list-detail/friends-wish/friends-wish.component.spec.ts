import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { WishApiMockService } from '@core/api/wish-api-mock.service';
import { WishApiService } from '@core/api/wish-api.service';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { BrowserService } from '@core/services/browser.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { WishListTestDataUtils } from '@core/test/wish-list-data.utils';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishShopInfoComponentFake } from '@test/components/wish-shop-info.component.mock';
import { FriendsWishComponent } from './friends-wish.component';

describe('FriendsWishComponent', () => {
  let component: FriendsWishComponent;
  let fixture: ComponentFixture<FriendsWishComponent>;

  const wishKindle = WishListTestData.sharedWishKindle;

  const browserService: BrowserService = jasmine.createSpyObj('browserService', ['openSystemBrowser']);
  const wishApiService: WishApiMockService = new WishApiMockService();
  const affiliateService: any = {
    createAffiliateLink: (productUrlString: string): Promise<string> => {
      return Promise.resolve('https://www.affiliate-link.de/product-id')
    }
  };
  const modalController: any = {
    create(opts): Promise<any> { return Promise.resolve(); }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsWishComponent, WishImageComponentFake, WishShopInfoComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserService },
        { provide: WishApiService, useValue: wishApiService },
        { provide: AffiliateLinkService, useValue: affiliateService },
        { provide: ModalController, useValue: modalController }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsWishComponent);
    component = fixture.componentInstance;

    component.wish = wishKindle;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openProductURL', () => {
    it('should open product url in browser', () => {
      component.openProductURL();
      expect(browserService.openSystemBrowser).toHaveBeenCalledWith('https://www.affiliate-link.de/product-id');
    })
  });

  describe('reserve', () => {

    it('should reserve a wish', fakeAsync(() => {
      const expectedWish = WishListTestDataUtils.fakeReserveStateChange(wishKindle, false);
      const outputSpy = spyOn(component.wishPurchase, 'emit');

      wishApiService.reserveWishResponse = of(expectedWish);
      component.reserve();
      tick();

      expect(component.wish).toBe(expectedWish);
      expect(outputSpy).toHaveBeenCalledWith(expectedWish);
      flush();
    }));

  });

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
