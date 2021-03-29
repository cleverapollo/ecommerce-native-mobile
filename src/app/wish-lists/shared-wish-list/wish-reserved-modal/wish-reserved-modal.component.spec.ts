import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishReservedModalComponent } from './wish-reserved-modal.component';

describe('WishReservedModalComponent', () => {
  let component: WishReservedModalComponent;
  let fixture: ComponentFixture<WishReservedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishReservedModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishReservedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
