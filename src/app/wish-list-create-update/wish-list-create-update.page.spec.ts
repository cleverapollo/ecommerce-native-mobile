import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListCreateUpdatePage } from './wish-list-create-update.page';

describe('WishListCreateUpdatePage', () => {
  let component: WishListCreateUpdatePage;
  let fixture: ComponentFixture<WishListCreateUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListCreateUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListCreateUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
