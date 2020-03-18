import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendWishListComponent } from './friend-wish-list.component';

describe('FriendWishListComponent', () => {
  let component: FriendWishListComponent;
  let fixture: ComponentFixture<FriendWishListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendWishListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendWishListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
