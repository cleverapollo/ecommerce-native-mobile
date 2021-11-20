import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { FriendsWishListOverviewPage } from '@friends/friends-wish-list-overview/friends-wish-list-overview.page';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { NavToolbarComponent } from '@shared/components/nav-toolbar/nav-toolbar.component';
import { FriendWishListComponent } from './friend-wish-list/friend-wish-list.component';
import { EmailUnverifiedHintComponent } from '@shared/components/email-unverified-hint/email-unverified-hint.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FriendsWishListOverviewPage', () => {
  let component: FriendsWishListOverviewPage;
  let fixture: ComponentFixture<FriendsWishListOverviewPage>;

  let navContoller: any;
  let friendWishListStore: any;
  let analyticsService: AnalyticsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        FriendsWishListOverviewPage,
        NavToolbarComponent,
        FriendWishListComponent,
        EmailUnverifiedHintComponent
      ],
      imports: [IonicModule.forRoot(),, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: FriendWishListStoreService, useValue: friendWishListStore },
        { provide: NavController, useValue: navContoller },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsWishListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
