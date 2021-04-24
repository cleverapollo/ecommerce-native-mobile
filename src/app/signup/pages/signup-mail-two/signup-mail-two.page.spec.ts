import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupMailTwoPage } from './signup-mail-two.page';

describe('SignupMailTwoPage', () => {
  let component: SignupMailTwoPage;
  let fixture: ComponentFixture<SignupMailTwoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailTwoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMailTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
