import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListCreatePage } from './wish-list-create.page';

describe('WishListCreatePage', () => {
  let component: WishListCreatePage;
  let fixture: ComponentFixture<WishListCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
