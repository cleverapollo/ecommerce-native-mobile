import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupCompletedPage } from './signup-completed.page';

describe('SignupCompletedPage', () => {
  let component: SignupCompletedPage;
  let fixture: ComponentFixture<SignupCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupCompletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
