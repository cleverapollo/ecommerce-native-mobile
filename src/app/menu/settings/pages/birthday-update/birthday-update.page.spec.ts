import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BirthdayUpdatePage } from './birthday-update.page';

describe('BirthdayUpdatePage', () => {
  let component: BirthdayUpdatePage;
  let fixture: ComponentFixture<BirthdayUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayUpdatePage ],
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
