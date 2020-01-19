import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountFirstNamePage } from './account-first-name.page';

describe('AccountFirstNamePage', () => {
  let component: AccountFirstNamePage;
  let fixture: ComponentFixture<AccountFirstNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFirstNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFirstNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
