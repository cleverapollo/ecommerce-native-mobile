import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { WishApiMockService } from '@core/api/wish-api-mock.service';
import { WishApiService } from '@core/api/wish-api.service';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { BrowserService } from '@core/services/browser.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { WishListTestDataUtils } from '@core/test/wish-list-data.utils';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import { FriendsWishComponent } from './friends-wish.component';

describe('FriendsWishComponent', () => {
  let component: FriendsWishComponent;
  let fixture: ComponentFixture<FriendsWishComponent>;

  const wishKindle = WishListTestData.sharedWishKindle;

  let browserService: BrowserService = jasmine.createSpyObj('browserService', ['openSystemBrowser']);  
  let wishApiService: WishApiMockService = new WishApiMockService();
  let affiliateService: any = {
    createAffiliateLink: function (productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link.de/product-id')
    }
  };
  let modalController: any = {
    create(opts): Promise<any> { return Promise.resolve(); }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsWishComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browserService },
        { provide: WishApiService, useValue: wishApiService },
        { provide: AffiliateLinkService, useValue: affiliateService },
        { provide: ModalController, useValue: modalController }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
      const outputSpy = spyOn(component.onWishPurchased, 'emit');

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
