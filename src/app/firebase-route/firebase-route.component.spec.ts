import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseRouteComponent } from './firebase-route.component';

describe('FirebaseRouteComponent', () => {
  let component: FirebaseRouteComponent;
  let fixture: ComponentFixture<FirebaseRouteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FirebaseRouteComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
