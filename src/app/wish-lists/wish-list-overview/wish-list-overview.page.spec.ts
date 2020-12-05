import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListOverviewPage } from './wish-list-overview.page';

describe('WishListOverviewPage', () => {
  let component: WishListOverviewPage;
  let fixture: ComponentFixture<WishListOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
