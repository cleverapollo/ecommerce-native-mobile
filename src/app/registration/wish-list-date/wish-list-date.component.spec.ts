import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListDateComponent } from './wish-list-date.component';

describe('WishListDateComponent', () => {
  let component: WishListDateComponent;
  let fixture: ComponentFixture<WishListDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListDateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
