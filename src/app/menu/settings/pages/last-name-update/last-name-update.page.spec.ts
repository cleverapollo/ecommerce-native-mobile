import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LastNameUpdatePage } from './last-name-update.page';

describe('LastNameUpdatePage', () => {
  let component: LastNameUpdatePage;
  let fixture: ComponentFixture<LastNameUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastNameUpdatePage ],
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
