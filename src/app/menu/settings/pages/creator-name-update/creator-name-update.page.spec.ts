import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { of } from 'rxjs';
import { userMax } from 'src/app/test/fixtures/user.fixture';

import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { CreatorNameUpdatePage } from './creator-name-update.page';

describe('CreatorNameUpdatePage', () => {

  let component: CreatorNameUpdatePage;
  let fixture: ComponentFixture<CreatorNameUpdatePage>;

  let loadingService: jasmine.SpyObj<LoadingService> = jasmine.createSpyObj('loadingService', ['showLoadingSpinner', 'stopLoadingSpinner']);
  let toastService: ToastService = new MockToastService();
  let userStoreSpy: jasmine.SpyObj<UserProfileStore> = jasmine.createSpyObj('UserProfileStore', {
    loadUserProfile: of(userMax)
  });
  let analyticsService: jasmine.SpyObj<AnalyticsService> = jasmine.createSpyObj('analyticsService', ['setFirebaseScreenName']);
  let api: jasmine.SpyObj<ContentCreatorApiService> = jasmine.createSpyObj('api', ['updateName']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorNameUpdatePage, NavToolbarComponentFake, ValidationMessagesComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: UserProfileStore, useValue: userStoreSpy },
        { provide: ContentCreatorApiService, useValue: api }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorNameUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(userStoreSpy.loadUserProfile).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(component.user).toEqual(userMax);
  });

  it('should send a analytics screen event', () => {
    component.ionViewDidEnter();
    expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('profile_settings-creator-name');
  })
});
