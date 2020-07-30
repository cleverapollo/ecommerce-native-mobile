import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListGuestsPage } from './wish-list-guests.page';

describe('WishListGuestsPage', () => {
  let component: WishListGuestsPage;
  let fixture: ComponentFixture<WishListGuestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListGuestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListGuestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
