import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiveSharedWishModalComponent } from './give-shared-wish-modal.component';

describe('GiveSharedWishModalComponent', () => {
  let component: GiveSharedWishModalComponent;
  let fixture: ComponentFixture<GiveSharedWishModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveSharedWishModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiveSharedWishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
