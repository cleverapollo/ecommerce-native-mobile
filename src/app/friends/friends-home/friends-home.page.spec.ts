import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouterTestingModule } from '@angular/router/testing';
import { FriendsHomePage } from './friends-home.page';

describe('FriendsHomePage', () => {
  let component: FriendsHomePage;
  let fixture: ComponentFixture<FriendsHomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsHomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
