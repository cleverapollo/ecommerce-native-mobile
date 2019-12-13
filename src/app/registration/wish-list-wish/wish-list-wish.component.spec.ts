import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListWishComponent } from './wish-list-wish.component';

describe('WishListWishComponent', () => {
  let component: WishListWishComponent;
  let fixture: ComponentFixture<WishListWishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListWishComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
