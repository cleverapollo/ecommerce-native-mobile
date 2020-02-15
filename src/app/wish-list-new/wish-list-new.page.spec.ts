import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListNewPage } from './wish-list-new.page';

describe('WishListNewPage', () => {
  let component: WishListNewPage;
  let fixture: ComponentFixture<WishListNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
