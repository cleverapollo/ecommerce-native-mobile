import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListRadioComponent } from './wish-list-radio.component';

describe('WishListRadioComponent', () => {
  let component: WishListRadioComponent;
  let fixture: ComponentFixture<WishListRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListRadioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
