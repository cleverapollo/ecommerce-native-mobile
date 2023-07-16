import { CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BackgroundImageDirective } from './background-image.directive';

@Component({
  template: `
    <div appBackgroundImage [src]="imageUrl" class="lazy-background-image"></div>
  `
})
class TestComponent {
  imageUrl: string;
}

describe('BackgroundImageDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, BackgroundImageDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.imageUrl = '';
    element = fixture.debugElement.query(By.directive(BackgroundImageDirective));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
  });

  it('should set the background image', () => {
    component.imageUrl = '/path/to/image.jpg';
    fixture.detectChanges();
    expect(element.nativeElement.style.backgroundImage).toBe(`url("${component.imageUrl}")`);
  });
});
