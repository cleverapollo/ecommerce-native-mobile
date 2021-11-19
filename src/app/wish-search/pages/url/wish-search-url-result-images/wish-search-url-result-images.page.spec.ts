import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultImagesPage } from './wish-search-url-result-images.page';

describe('WishSearchUrlResultImagesPage', () => {
  let component: WishSearchUrlResultImagesPage;
  let fixture: ComponentFixture<WishSearchUrlResultImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishSearchUrlResultImagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishSearchUrlResultImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
