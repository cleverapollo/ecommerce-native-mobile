import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AffiliateLinkDebugInfoComponent } from './affiliate-link-debug-info.component';

describe('AffiliateLinkDebugInfoComponent', () => {
  let component: AffiliateLinkDebugInfoComponent;
  let fixture: ComponentFixture<AffiliateLinkDebugInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateLinkDebugInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AffiliateLinkDebugInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
