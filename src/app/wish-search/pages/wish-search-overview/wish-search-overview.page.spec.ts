import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishSearchOverviewPage } from './wish-search-overview.page';

describe('WishSearchSelectionPage', () => {
  let component: WishSearchOverviewPage;
  let fixture: ComponentFixture<WishSearchOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishSearchOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishSearchOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});