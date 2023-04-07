import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { creatorMax } from '@test/fixtures/user.fixture';
import { UserInitialsComponent } from '../user-initials/user-initials.component';

import { CreatorComponent } from './creator.component';

describe('CreatorComponent', () => {
  let component: CreatorComponent;
  let fixture: ComponentFixture<CreatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorComponent, UserInitialsComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorComponent);
    component = fixture.componentInstance;
    component.account = creatorMax;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component.showShareButton).toBeFalsy();
    expect(component).toBeTruthy();
  });

  it('should show share button', async () => {
    component.showShareButton = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
  })
});
