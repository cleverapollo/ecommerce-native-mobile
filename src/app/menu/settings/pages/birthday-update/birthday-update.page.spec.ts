import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { BirthdayUpdatePage } from './birthday-update.page';

describe('BirthdayUpdatePage', () => {
  let component: BirthdayUpdatePage;
  let fixture: ComponentFixture<BirthdayUpdatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BirthdayUpdatePage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BirthdayUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
