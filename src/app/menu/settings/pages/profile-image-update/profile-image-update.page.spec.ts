import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnalyticsService } from '@core/services/analytics.service';
import { MockLoadingService } from '@core/services/loading-mock.service';
import { LoadingService } from '@core/services/loading.service';
import { MockToastService } from '@core/services/toast-mock.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { PhotoComponentFake } from '@test/components/photo.component.mock';
import { userMax } from '@test/fixtures/user.fixture';
import { BehaviorSubject } from 'rxjs';
import { ProfileImageUpdatePage } from './profile-image-update.page';

describe('ProfileImageUpdatePage', () => {
  let component: ProfileImageUpdatePage;
  let fixture: ComponentFixture<ProfileImageUpdatePage>;

  let analyticsService: AnalyticsService
  let loadingService = new MockLoadingService();
  let toastService = new MockToastService();

  let userStoreSpy: Partial<UserProfileStore> = {
    user$: new BehaviorSubject(userMax),
    isCreatorAccountActive$: new BehaviorSubject(false),
    downloadUserImage: jasmine.createSpy('downloadUserImage')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileImageUpdatePage, NavToolbarComponentFake, PhotoComponentFake, EmailUnverifiedHintComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: UserProfileStore, useValue: userStoreSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileImageUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
