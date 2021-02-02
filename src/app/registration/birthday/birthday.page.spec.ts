import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BirthdayPage } from './birthday.page';

describe('BirthdayPage', () => {
  let component: BirthdayPage;
  let fixture: ComponentFixture<BirthdayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BirthdayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
