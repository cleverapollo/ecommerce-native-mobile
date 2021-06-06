import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupMailPage } from './signup-mail.page';

describe('SignupMailPage', () => {
  let component: SignupMailPage;
  let fixture: ComponentFixture<SignupMailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
