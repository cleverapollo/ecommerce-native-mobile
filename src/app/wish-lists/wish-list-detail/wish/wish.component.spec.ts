import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { WishShopInfoComponentFake } from '@test/components/wish-shop-info.component.mock';
import { WishComponent } from './wish.component';

describe('WishComponent', () => {
  let component: WishComponent;
  let fixture: ComponentFixture<WishComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WishComponent, WishImageComponentFake, WishShopInfoComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
