import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendsWishListOverviewPage } from '@friends/friends-wish-list-overview/friends-wish-list-overview.page';

describe('FriendsWishListOverviewPage', () => {
  let component: FriendsWishListOverviewPage;
  let fixture: ComponentFixture<FriendsWishListOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsWishListOverviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsWishListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
