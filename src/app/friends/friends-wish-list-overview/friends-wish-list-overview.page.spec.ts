import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';
import { FriendsWishListOverviewPage } from '@friends/friends-wish-list-overview/friends-wish-list-overview.page';
import { EmailUnverifiedHintComponent } from '@shared/components/email-unverified-hint/email-unverified-hint.component';
import { NavToolbarComponent } from '@shared/components/nav-toolbar/nav-toolbar.component';
import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { FriendWishListComponent } from './friend-wish-list/friend-wish-list.component';

describe('FriendsWishListOverviewPage', () => {
  let component: FriendsWishListOverviewPage;
  let fixture: ComponentFixture<FriendsWishListOverviewPage>;

  const navContoller: any = {};
  const friendWishListStore: any = {};
  const analyticsService: any = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FriendsWishListOverviewPage,
        NavToolbarComponent,
        FriendWishListComponent,
        EmailUnverifiedHintComponent,
        NavToolbarComponentFake,
        EmailUnverifiedHintComponentFake
      ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: FriendWishListStoreService, useValue: friendWishListStore },
        { provide: NavController, useValue: navContoller },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsWishListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
