import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishNewPage } from './wish-new.page';

describe('WishNewPage', () => {
  let component: WishNewPage;
  let fixture: ComponentFixture<WishNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
