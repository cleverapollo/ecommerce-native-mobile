import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListPartnerPage } from './wish-list-partner.page';

describe('WishListPartnerComponent', () => {
  let component: WishListPartnerPage;
  let fixture: ComponentFixture<WishListPartnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListPartnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
