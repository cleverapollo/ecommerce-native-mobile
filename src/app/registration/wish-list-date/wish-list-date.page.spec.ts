import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListDatePage } from './wish-list-date.page';

describe('WishListDateComponent', () => {
  let component: WishListDatePage;
  let fixture: ComponentFixture<WishListDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListDatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
