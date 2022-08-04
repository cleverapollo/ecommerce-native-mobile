import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileSettingsFirstnamePage } from './profile-settings-firstname.page';

describe('ProfileSettingsFirstnamePage', () => {
  let component: ProfileSettingsFirstnamePage;
  let fixture: ComponentFixture<ProfileSettingsFirstnamePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsFirstnamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsFirstnamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
