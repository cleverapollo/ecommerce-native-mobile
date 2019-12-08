import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishListNameComponent } from './wish-list-name.component';

describe('WishListNameComponent', () => {
  let component: WishListNameComponent;
  let fixture: ComponentFixture<WishListNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListNameComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
