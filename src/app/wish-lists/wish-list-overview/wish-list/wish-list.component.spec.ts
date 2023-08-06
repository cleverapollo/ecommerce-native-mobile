import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishListComponent } from './wish-list.component';

describe('WishListComponent', () => {
  let component: WishListComponent;
  let fixture: ComponentFixture<WishListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishListComponent, WishImageComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
