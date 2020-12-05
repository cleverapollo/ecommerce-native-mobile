import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishSearchPage } from './wish-search.page';

describe('WishSearchPage', () => {
  let component: WishSearchPage;
  let fixture: ComponentFixture<WishSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
