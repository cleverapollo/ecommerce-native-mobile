import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonDatetime, IonicModule, IonInput, IonModal } from '@ionic/angular';

import { DatetimeComponent } from './datetime.component';

describe('DatetimeComponent', () => {
  let component: DatetimeComponent;
  let fixture: ComponentFixture<DatetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimeComponent ],
      imports: [IonicModule.forRoot()]
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
   
    it('updates the selected date and the formatted date', () => {
      const spy = spyOn(component, 'propagateChange');
      component.onDateChanged('2022-04-13T17:28:16+0000');

      expect(component.selectedDate).toEqual('2022-04-13T17:28:16+0000');
      expect(component.formattedDate).toEqual('13.04.2022');
      expect(spy).toHaveBeenCalled();
    });

    it('resets selected and formatted date if new value is undefined', () => {
      const spy = spyOn(component, 'propagateChange');
      component.onDateChanged('2022-04-13T17:28:16+0000');
      component.onDateChanged(undefined);

      expect(component.selectedDate).toBeUndefined();
      expect(component.formattedDate).toBeUndefined();
      expect(spy).toHaveBeenCalled();
    });

    it('resets selected and formatted date if new value is null', () => {
      const spy = spyOn(component, 'propagateChange');
      component.onDateChanged('2022-04-13T17:28:16+0000');
      component.onDateChanged(null);

      expect(component.selectedDate).toBeNull();
      expect(component.formattedDate).toBeNull();
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
