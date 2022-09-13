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
  });

  describe('value', () => {

    it('is the selected date', () => {
      component.selectedDate = '2022-04-13T17:28:16+0000'
      fixture.detectChanges();
      expect(component.value).toEqual(component.selectedDate)
    })

    it('is the initial date', () => {
      component.initialDate = '2022-04-13T17:28:16+0000'
      fixture.detectChanges();
      expect(component.value).toEqual(component.initialDate)
    })

    it('is the current date', () => {
      expect(component.value).toEqual(new Date().toISOString())
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
      component.onDateChanged('2022-04-13T17:28:16+0000');

      expect(component.selectedDate).toEqual('2022-04-13T17:28:16+0000');
      expect(component.formattedDate).toEqual('13.04.2022');
      expect(spy).toHaveBeenCalled();
      expect(component.datetime.confirm).toHaveBeenCalledWith(true)
    });

    it('resets selected and formatted date if new value is undefined', () => {
      const spy = spyOn(component, 'propagateChange');
      component.onDateChanged(undefined);

      expect(component.selectedDate).toBeUndefined();
      expect(component.formattedDate).toBeUndefined();
      expect(spy).toHaveBeenCalled();
      expect(component.datetime.confirm).toHaveBeenCalledWith(true)
    });

    it('resets selected and formatted date if new value is null', () => {
      const spy = spyOn(component, 'propagateChange');
      component.onDateChanged(null);

      expect(component.selectedDate).toBeNull();
      expect(component.formattedDate).toBeUndefined();
      expect(spy).toHaveBeenCalled();
      expect(component.datetime.confirm).toHaveBeenCalledWith(true)
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
