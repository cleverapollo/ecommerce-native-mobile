import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WishDto } from '@core/models/wish-list.model';
import { WishListTestData } from '@core/test/wish-list-data';
import { IonicModule } from '@ionic/angular';

import { WishShopInfoComponent, WishShopInfoComponentStyles } from './wish-shop-info.component';

describe('WishShopInfoComponent', () => {
  let component: WishShopInfoComponent;
  let fixture: ComponentFixture<WishShopInfoComponent>;
  const noStyles: WishShopInfoComponentStyles = {
    shopInfoOverlay: { },
    iconStar: { },
    shopLogoContainer: { },
    priceInfo: { }
  }
  const exampleStyle: WishShopInfoComponentStyles = {
    shopInfoOverlay: {
      'min-width': '59px',
      'min-height': '77px'
    },
    iconStar: {
      'font-size': '19px'
    },
    shopLogoContainer: {
      'max-height': '21px',
      'margin-top': '4px',
      'margin-bottom': '4px'
    },
    priceInfo: {
      'letter-spacing': '-0.7px',
      font: 'normal normal 900 20px/20px Roboto'
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishShopInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishShopInfoComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    component.wish = new WishDto();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.styles).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should init component for wish', () => {
      const wish = WishListTestData.wishKindle;
      component.wish = wish;
      component.styles = noStyles;
      fixture.detectChanges();
      expect(component.fillIconCSSClass).toBe('fill-gray');
      expect(component.priceDisplayString).toBe('79,99 €');
      expect(component.shopLogoUrl).toBeNull();
      expect(component.styles).toBeDefined();
    });

    it('should init component for favorite wish', () => {
      const wish = WishListTestData.wishBoschWasher;
      component.wish = wish;
      component.styles = noStyles;
      fixture.detectChanges();
      expect(component.fillIconCSSClass).toBe('fill-primary');
      expect(component.priceDisplayString).toBe('469,00 €');
      expect(component.shopLogoUrl).toBeNull();
      expect(component.styles).toBeDefined();
    });

    it('should init component for shared wish', () => {
      const wish = WishListTestData.sharedWishKindle;
      component.wish = wish;
      component.styles = noStyles;
      fixture.detectChanges();
      expect(component.fillIconCSSClass).toBe('fill-gray');
      expect(component.priceDisplayString).toBe('79,99 €');
      expect(component.shopLogoUrl).toBeNull();
      expect(component.styles).toBeDefined();
    });

    it('should init component for favorite shared wish', () => {
      const wish = WishListTestData.sharedWishBoschWasher;
      component.wish = wish;
      component.styles = noStyles;
      fixture.detectChanges();
      expect(component.fillIconCSSClass).toBe('fill-primary');
      expect(component.priceDisplayString).toBe('469,00 €');
      expect(component.shopLogoUrl).toBeNull();
      expect(component.styles).toBeDefined();
    });
  });

  describe('renderer', () => {

    it('should render a star icon and a price', () => {
      const wish = WishListTestData.wishBoschWasher;
      component.wish = wish;
      component.styles = exampleStyle;
      fixture.detectChanges();

      const containerElement: HTMLDivElement = fixture.debugElement.query(By.css('.wish-info-overlay-container')).nativeElement;
      expect(containerElement).toBeDefined();

      const shopInfoOverlayElement: HTMLDivElement = containerElement.querySelector('.shop-info-overlay');
      expect(shopInfoOverlayElement).toBeDefined();
      expect(shopInfoOverlayElement.style.minWidth).toBe('59px');
      expect(shopInfoOverlayElement.style.minHeight).toBe('77px');

      const starIcon: HTMLIonIconElement = shopInfoOverlayElement.querySelector('.icon-star') as HTMLIonIconElement;
      expect(starIcon.style.fontSize).toBe('19px');
      expect(starIcon).toBeDefined();

      const priceInfoElement: HTMLDivElement = shopInfoOverlayElement.querySelector('.price-info');
      expect(priceInfoElement).toBeDefined();
      expect(priceInfoElement.innerText).toBe('469,00 €');
      expect(priceInfoElement.style.letterSpacing).toBe('-0.7px');
      expect(priceInfoElement.style.font).toBe('900 20px / 20px Roboto');
      expect(priceInfoElement.style.fontStyle).toBe('normal');

      const shopLogoContainer: HTMLDivElement = shopInfoOverlayElement.querySelector('.shop-logo-container');
      expect(shopLogoContainer).toBeNull();
    });

  });


});
