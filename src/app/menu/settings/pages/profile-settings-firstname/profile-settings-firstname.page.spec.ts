import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { ProfileSettingsFirstnamePage } from './profile-settings-firstname.page';

describe('ProfileSettingsFirstnamePage', () => {
  let component: ProfileSettingsFirstnamePage;
  let fixture: ComponentFixture<ProfileSettingsFirstnamePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingsFirstnamePage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
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
