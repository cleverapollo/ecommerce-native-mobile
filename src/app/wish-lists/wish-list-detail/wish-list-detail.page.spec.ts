import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListDetailPage } from './wish-list-detail.page';

describe('WishListDetailPage', () => {
  let component: WishListDetailPage;
  let fixture: ComponentFixture<WishListDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
