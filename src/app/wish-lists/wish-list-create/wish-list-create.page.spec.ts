import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { IonicModule, NavController } from '@ionic/angular';
import { DatetimeComponent } from '@shared/components/datetime/datetime.component';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { WishListCreatePage } from './wish-list-create.page';

describe('WishListCreatePage', () => {
  let component: WishListCreatePage;
  let fixture: ComponentFixture<WishListCreatePage>;

  const navControllerMock: any = {};
  const toastServiceMock: ToastService = new MockToastService();
  const wishListStoreMock = new MockWishListStoreService();
  const loadingServiceMock = new MockLoadingService()
  const analyticsServiceSpy = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['setFirebaseScreenName']);

  const routes = [];
  let router: Router

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishListCreatePage, DatetimeComponent, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule, FormsModule
      ],
      providers: [
        { provide: CoreToastService, useValue: toastServiceMock },
        { provide: WishListStoreService, useValue: wishListStoreMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
        { provide: NavController, useValue: navControllerMock },
      ]
    }).compileComponents();

    router = TestBed.inject(Router); (2)

    fixture = TestBed.createComponent(WishListCreatePage);
    router.initialNavigation();
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
