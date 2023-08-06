import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService, ToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { userMax } from '@test/fixtures/user.fixture';
import { of } from 'rxjs';

import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { CreatorSocialMediaLinksUpdatePage } from './creator-social-media-links-update.page';

describe('CreatorSocialMediaLinksUpdatePage', () => {
  let component: CreatorSocialMediaLinksUpdatePage;
  let fixture: ComponentFixture<CreatorSocialMediaLinksUpdatePage>;

  let loadingService: jasmine.SpyObj<LoadingService> = jasmine.createSpyObj('LoadingService', ['showLoadingSpinner', 'stopLoadingSpinner']);
  let toastService: ToastService = new MockToastService();
  let userStoreSpy: jasmine.SpyObj<UserProfileStore> = jasmine.createSpyObj('UserProfileStore', {
    loadUserProfile: of(userMax)
  });
  let analyticsService: jasmine.SpyObj<AnalyticsService> = jasmine.createSpyObj('AnalyticsService', ['setFirebaseScreenName']);
  let api: jasmine.SpyObj<ContentCreatorApiService> = jasmine.createSpyObj('ContentCreatorApiService', ['updateSocialMediaLinks']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorSocialMediaLinksUpdatePage, NavToolbarComponentFake, ValidationMessagesComponentFake],
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

    fixture = TestBed.createComponent(CreatorSocialMediaLinksUpdatePage);
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
    expect(analyticsService.setFirebaseScreenName).toHaveBeenCalledWith('profile_settings-creator-social_media_links');
  })
});
