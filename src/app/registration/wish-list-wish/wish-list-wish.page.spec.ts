import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListWishPage } from './wish-list-wish.page';

describe('WishListWishComponent', () => {
  let component: WishListWishPage;
  let fixture: ComponentFixture<WishListWishPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListWishPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListWishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
