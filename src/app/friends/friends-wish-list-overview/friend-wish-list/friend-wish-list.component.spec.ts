import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { FriendWishListComponent } from './friend-wish-list.component';

describe('FriendWishListComponent', () => {
  let component: FriendWishListComponent;
  let fixture: ComponentFixture<FriendWishListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FriendWishListComponent, WishImageComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendWishListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
