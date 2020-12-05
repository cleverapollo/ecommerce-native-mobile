import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelWishReservationModalComponent } from './cancel-wish-reservation-modal.component';

describe('CancelWishReservationModalComponent', () => {
  let component: CancelWishReservationModalComponent;
  let fixture: ComponentFixture<CancelWishReservationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelWishReservationModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelWishReservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
