import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountDeletePage } from './account-delete.page';

describe('AccountDeletePage', () => {
  let component: AccountDeletePage;
  let fixture: ComponentFixture<AccountDeletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDeletePage ],
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
