import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WishListApiMockService } from '@core/api/wish-list-mock.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishCreatePage } from './wish-create.page';



describe('WishCreatePage', () => {
  let component: WishCreatePage;
  let fixture: ComponentFixture<WishCreatePage>;

  const loadingServiceFake = new MockLoadingService();
  const wishListStoreFake = new WishListApiMockService();
  const toastServiceFake = new MockToastService();
  const searchResultDataServiceSpy = jasmine.createSpyObj<SearchResultDataService>('searchResultDataService', ['clear']);
  const analyticsServiceSpy = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['setFirebaseScreenName']);

  let router: Router;
  const routes: Routes = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishCreatePage, NavToolbarComponentFake, WishImageComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: LoadingService, useValue: loadingServiceFake },
        { provide: WishListStoreService, useValue: wishListStoreFake },
        { provide: CoreToastService, useValue: toastServiceFake },
        { provide: SearchResultDataService, useValue: searchResultDataServiceSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(WishCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
