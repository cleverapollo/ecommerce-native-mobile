import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { CoreToastService } from '@core/services/toast.service';
import { IonicModule } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';

import { CreatorAccountCreatePage } from './creator-account-create.page';

describe('CreatorAccountCreatePage', () => {
  let component: CreatorAccountCreatePage;
  let fixture: ComponentFixture<CreatorAccountCreatePage>;

  const analyticsService = {};
  const userProfileStore = {};
  const contentCreatorApi = {};
  const loadingService = {};
  const toastService = {};
  const navService = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorAccountCreatePage],
      imports: [IonicModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: UserProfileStore, useValue: userProfileStore },
        { provide: ContentCreatorApiService, useValue: contentCreatorApi },
        { provide: LoadingService, useValue: loadingService },
        { provide: CoreToastService, useValue: toastService },
        { provide: NavigationService, useValue: navService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorAccountCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});