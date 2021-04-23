import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupMailOnePage } from './signup-mail-one.page';

describe('SignupMailOnePage', () => {
  let component: SignupMailOnePage;
  let fixture: ComponentFixture<SignupMailOnePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupMailOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupMailOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
