import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishEditPage } from './wish-edit.page';

describe('WishEditPage', () => {
  let component: WishEditPage;
  let fixture: ComponentFixture<WishEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
