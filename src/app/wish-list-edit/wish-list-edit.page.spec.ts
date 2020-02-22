import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListEditPage } from './wish-list-edit.page';

describe('WishListEditPage', () => {
  let component: WishListEditPage;
  let fixture: ComponentFixture<WishListEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
