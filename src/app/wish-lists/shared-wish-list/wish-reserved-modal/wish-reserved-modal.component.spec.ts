import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailVerificationStatus } from '@core/models/user.model';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { IonicModule } from '@ionic/angular';
import { OwnerNamesPipe } from '@shared/pipes/owner-names.pipe';

import { WishReservedModalComponent } from './wish-reserved-modal.component';

describe('WishReservedModalComponent', () => {
  let component: WishReservedModalComponent;
  let fixture: ComponentFixture<WishReservedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishReservedModalComponent, OwnerNamesPipe ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishReservedModalComponent);
    component = fixture.componentInstance;
    component.wishList = { 
      id: '1', 
      name: 'Testlist',
      date: '2021-10-03', 
      owners: [{  
        firstName: 'Max', 
        lastName: 'Mustermann', 
        emailVerificationStatus: EmailVerificationStatus.VERIFIED 
      }], 
      wishes: [] 
    }
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
