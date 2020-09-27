import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedWishListPage } from './shared-wish-list.page';

describe('SharedWishListPage', () => {
  let component: SharedWishListPage;
  let fixture: ComponentFixture<SharedWishListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWishListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedWishListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
