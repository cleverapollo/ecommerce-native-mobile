import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailUnverifiedHintComponentFake } from '@test/components/email-unverified-hint.component.mock';
import { NavToolbarComponentFake } from '@test/components/nav-toolbar.component.mock';
import { AccountDeletePage } from './account-delete.page';

describe('AccountDeletePage', () => {
  let component: AccountDeletePage;
  let fixture: ComponentFixture<AccountDeletePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDeletePage, NavToolbarComponentFake, EmailUnverifiedHintComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDeletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
