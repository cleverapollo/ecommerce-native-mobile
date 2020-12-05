import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FriendsWishListDetailPage } from './friends-wish-list-detail.page';


describe('FriendsWishListDetailPage', () => {
  let component: FriendsWishListDetailPage;
  let fixture: ComponentFixture<FriendsWishListDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsWishListDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsWishListDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
