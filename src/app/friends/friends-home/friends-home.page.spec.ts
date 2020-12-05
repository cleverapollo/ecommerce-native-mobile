import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FriendsHomePage } from './friends-home.page';

describe('FriendsHomePage', () => {
  let component: FriendsHomePage;
  let fixture: ComponentFixture<FriendsHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
