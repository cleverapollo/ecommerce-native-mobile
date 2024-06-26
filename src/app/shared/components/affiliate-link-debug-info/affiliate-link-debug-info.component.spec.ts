import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AffiliateLinkService } from '@core/services/affiliate/affiliate-link.service';
import { IonicModule, ModalController } from '@ionic/angular';

import { AffiliateLinkDebugInfoComponent } from './affiliate-link-debug-info.component';

describe('AffiliateLinkDebugInfoComponent', () => {

  const affiliateService: any = {
    createAffiliateLink(): Promise<string> {
      return Promise.resolve('affiliateLink');
    }
  };
  const modalController: any = {};

  let component: AffiliateLinkDebugInfoComponent;
  let fixture: ComponentFixture<AffiliateLinkDebugInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateLinkDebugInfoComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AffiliateLinkService, useValue: affiliateService },
        { provide: ModalController, useValue: modalController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateLinkDebugInfoComponent);
    component = fixture.componentInstance;
    component.wish = {
      id: '1',
      wishListId: '1',
      name: 'BOSCH Waschmaschine 4 WAN282A8, 8 kg, 1400 U/min',
      price: {
        amount: 469.0,
        currency: 'EUR',
        displayString: '469,00 €'
      },
      productUrl: 'https://www.otto.de/p/bosch-waschmaschine-4-wan282a8-8-kg-1400-u-min-1214867044/#variationId=1243447578',
      imageUrl: 'https://i.otto.de/i/otto/2233c1d8-93ed-50da-8618-a1c6241c0254?$001PICT36$',
      reservedByFriend: false,
      bought: false,
      isFavorite: false
    }
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
