import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonicModule } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { of } from 'rxjs';

import { ProductListOverviewPage } from './product-list-overview.page';

describe('ProductListOverviewPage', () => {
  let component: ProductListOverviewPage;
  let fixture: ComponentFixture<ProductListOverviewPage>;

  const analyticsService = {};
  let userProfileStore = {
    loadUserProfile: () => of(new UserProfile())
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListOverviewPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: UserProfileStore, useValue: userProfileStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
