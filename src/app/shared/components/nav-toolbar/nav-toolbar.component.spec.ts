import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NavToolbarComponent } from './nav-toolbar.component';

describe('NavToolbarComponent', () => {
  let component: NavToolbarComponent;
  let fixture: ComponentFixture<NavToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavToolbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NavToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
