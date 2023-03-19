import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, IonInput } from '@ionic/angular';
import { DatetimeComponent } from './datetime.component';

describe('DatetimeComponent', () => {
  let component: DatetimeComponent;
  let fixture: ComponentFixture<DatetimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [
        DatetimeComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.formattedDate).toBeUndefined();
    expect(component.label).toBeUndefined();
    expect(component.placeholder).toBeUndefined();
    expect(component.value).toBeDefined();
  });

  it('sets a default value for the date', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    expect(component.value).toBeDefined();
    expect(component.value).not.toBeNull();
  })

  it('updates the label', () => {
    component.label = 'Datum des Ereignisses';
    fixture.detectChanges();

    const debugEl = fixture.debugElement;
    const labelDe = debugEl.query(By.css('label'));
    const label: HTMLLabelElement = labelDe.nativeElement;
    expect(label.innerText).toEqual('Datum des Ereignisses');
  })

  it('updates the placeholder', () => {
    component.placeholder = 'Datum';
    fixture.detectChanges();

    const debugEl = fixture.debugElement;
    const ioInputDe = debugEl.query(By.css('ion-input'));
    const ioInput: IonInput = ioInputDe.nativeElement;
    expect(ioInput.placeholder).toEqual('Datum');
  })

  describe('setDisabledState', () => {

    it('disables ion-datetime', () => {
      fixture.detectChanges();
      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();
    });

    it('enables ion-datetime', () => {
      fixture.detectChanges();
      component.setDisabledState(false);
      expect(component.disabled).toBeFalsy();
    });

  });
});
