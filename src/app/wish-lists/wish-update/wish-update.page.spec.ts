import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService } from '@core/services/toast.service';
import { MockWishListStoreService } from '@core/services/wish-list-store-mock.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { IonicModule } from '@ionic/angular';
import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishUpdatePage } from './wish-update.page';

describe('WishUpdatePage', () => {
  let component: WishUpdatePage;
  let fixture: ComponentFixture<WishUpdatePage>;

  const loadingServiceFake = new MockLoadingService();
  const wishListStoreMock = new MockWishListStoreService();
  const toastServiceFake = new MockToastService();
  const searchResultDataServiceSpy = jasmine.createSpyObj<SearchResultDataService>('searchResultDataService', ['clear']);
  const analyticsServiceSpy = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['setFirebaseScreenName']);

  let router: Router;
  const routes: Routes = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishUpdatePage, NavToolbarComponentFake, WishImageComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        FormsModule, ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: LoadingService, useValue: loadingServiceFake },
        { provide: WishListStoreService, useValue: wishListStoreMock },
        { provide: CoreToastService, useValue: toastServiceFake },
        { provide: SearchResultDataService, useValue: searchResultDataServiceSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(WishUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
