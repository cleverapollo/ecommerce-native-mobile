import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { creatorMax } from '@test/fixtures/user.fixture';
import { UserInitialsComponent } from '../user-initials/user-initials.component';

import { BrowserService } from '@core/services/browser.service';
import { Logger } from '@core/services/log.service';
import { PhotoComponentFake } from '@test/components/photo.component.mock';
import { CreatorComponent } from './creator.component';

describe('CreatorComponent', () => {

  let browser: BrowserService;
  let logger: Logger;

  let component: CreatorComponent;
  let fixture: ComponentFixture<CreatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorComponent, UserInitialsComponent, PhotoComponentFake],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: BrowserService, useValue: browser },
        { provide: Logger, useValue: logger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorComponent);
    component = fixture.componentInstance;
    component.account = creatorMax;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
