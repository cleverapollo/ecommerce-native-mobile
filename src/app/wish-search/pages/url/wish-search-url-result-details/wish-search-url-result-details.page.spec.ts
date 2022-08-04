import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultDetailsPage } from './wish-search-url-result-details.page';

describe('WishSearchUrlResultDetailsPage', () => {
  let component: WishSearchUrlResultDetailsPage;
  let fixture: ComponentFixture<WishSearchUrlResultDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishSearchUrlResultDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishSearchUrlResultDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
