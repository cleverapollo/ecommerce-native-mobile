import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { ValidationMessagesComponentFake } from '@test/components/validation-messages.component.mock';
import { LastNameUpdatePage } from './last-name-update.page';

describe('LastNameUpdatePage', () => {
  let component: LastNameUpdatePage;
  let fixture: ComponentFixture<LastNameUpdatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LastNameUpdatePage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake, ValidationMessagesComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LastNameUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
