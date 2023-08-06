import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { PasswordUpdatePage } from './password-update.page';

describe('PasswordUpdatePage', () => {
  let component: PasswordUpdatePage;
  let fixture: ComponentFixture<PasswordUpdatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordUpdatePage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
