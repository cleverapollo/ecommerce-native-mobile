import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyticsService } from '@core/services/analytics.service';
import { CreatorService } from '@core/services/creator.service';
import { IonicModule } from '@ionic/angular';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { creatorMax } from '@test/fixtures/user.fixture';
import { of } from 'rxjs';

import { CreatorComponentFake } from '@test/components/creator.component.mock';
import { CreatorDetailPage } from './creator-detail.page';

describe('CreatorDetailPage', () => {
  let component: CreatorDetailPage;
  let fixture: ComponentFixture<CreatorDetailPage>;

  let analyticsService: AnalyticsService;
  let creatorService: Partial<CreatorService> = {
    selectedCreator$: of(creatorMax)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorDetailPage, NavToolbarComponentFake, CreatorComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: CreatorService, useValue: creatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
