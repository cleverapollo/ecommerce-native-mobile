import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListNamePage } from './wish-list-name.page';

describe('WishListNameComponent', () => {
  let component: WishListNamePage;
  let fixture: ComponentFixture<WishListNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
