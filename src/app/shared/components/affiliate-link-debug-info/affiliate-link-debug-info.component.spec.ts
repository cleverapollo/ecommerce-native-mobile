import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AffiliateService } from '@core/services/affiliate.service';
import { IonicModule, ModalController } from '@ionic/angular';

import { AffiliateLinkDebugInfoComponent } from './affiliate-link-debug-info.component';

describe('AffiliateLinkDebugInfoComponent', () => {

  let affiliateService: any = {
    createAffiliateLink(): string {
      return 'affiliateLink'
    }
  };
  let modalController: any;

  let component: AffiliateLinkDebugInfoComponent;
  let fixture: ComponentFixture<AffiliateLinkDebugInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateLinkDebugInfoComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AffiliateService, useValue: affiliateService },
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
      bought: false
    }
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
