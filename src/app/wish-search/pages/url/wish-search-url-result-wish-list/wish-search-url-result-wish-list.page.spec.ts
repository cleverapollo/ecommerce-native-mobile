import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultWishListPage } from './wish-search-url-result-wish-list.page';

describe('WishSearchUrlResultWishListPage', () => {
  let component: WishSearchUrlResultWishListPage;
  let fixture: ComponentFixture<WishSearchUrlResultWishListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishSearchUrlResultWishListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishSearchUrlResultWishListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
