import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonInput, IonicModule } from '@ionic/angular';
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
  });

  describe('value', () => {

    it('is the selected date', async () => {
      component.selectedDate = '2022-04-13T17:28:16+0000'
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toEqual(component.selectedDate)
    })

    it('is the initial date', async () => {
      component.initialDate = '2022-04-13T17:28:16+0000'
      fixture.detectChanges();
      await fixture.whenStable();
      component.selectedDate = undefined;
      expect(component.value).toEqual(component.initialDate)
    })

    it('is the current date', () => {
      const expected = new Date().toISOString().split('T')[0];
      expect(component.value).toContain(expected)
    })
  })

  describe('label', () => {

    it('updates the label', () => {

      component.label = 'Datum des Ereignisses';
      fixture.detectChanges();

      const debugEl = fixture.debugElement;
      const labelDe = debugEl.query(By.css('label'));
      const label: HTMLLabelElement = labelDe.nativeElement;
      expect(label.innerText).toEqual('Datum des Ereignisses');
    })
  })

  describe('placeholder', () => {

    it('updates the placeholder', () => {

      component.placeholder = 'Datum';
      fixture.detectChanges();

      const debugEl = fixture.debugElement;
      const ioInputDe = debugEl.query(By.css('ion-input'));
      const ioInput: IonInput = ioInputDe.nativeElement;
      expect(ioInput.placeholder).toEqual('Datum');
    })
  })

  describe('onDateChanged', () => {

    beforeEach(() => {
      component.datetime = jasmine.createSpyObj('datetime', ['confirm'])
    })

    it('updates the selected date and the formatted date', () => {
      const spy = spyOn(component, 'propagateChange');
      component.selectedDate = '2022-04-13T17:28:16+0000';

      expect(component.selectedDate).toEqual('2022-04-13T17:28:16+0000');
      expect(component.formattedDate).toEqual('13.04.2022');
      expect(spy).toHaveBeenCalled();
    });

    it('resets selected and formatted date if new value is undefined', () => {
      const spy = spyOn(component, 'propagateChange');
      component.selectedDate = undefined;

      expect(component.selectedDate).toBeUndefined();
      expect(component.formattedDate).toEqual('');
      expect(spy).toHaveBeenCalled();
    });

    it('resets selected and formatted date if new value is null', () => {
      const spy = spyOn(component, 'propagateChange');
      component.selectedDate = null;

      expect(component.selectedDate).toBeNull();
      expect(component.formattedDate).toEqual('');
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('setDisabledState', () => {

    it('disables ion-datetime', () => {

      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();
    });

    it('enables ion-datetime', () => {

      component.setDisabledState(false);
      expect(component.disabled).toBeFalsy();
    });

  });
});
