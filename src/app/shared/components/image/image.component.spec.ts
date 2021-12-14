import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('onError', () => {

    const htmlImage: any = {  };
    htmlImage.src = "https://www.example.de/image.jpg";
    htmlImage.alt = "Example description";

    const event = {
      target: htmlImage
    }

    it('loads the fallback image', () => {  
      fixture.detectChanges();
      component.onError(event);
  
      expect(event.target.src).toBe(component.fallbackImageUrl);
      expect(event.target.alt).toBe(component.placeholderAltText);
      expect(component.imgClass).toBe('placeholder');
    });

    it('adds a css class to the placeholder image', () => {
      component.src = "https://www.example.de/image.jpg";
      component.alt = "Example description";
      component.imgClass = 'test-class';

      fixture.detectChanges();
      component.onError(event);

      expect(event.target.src).toBe(component.fallbackImageUrl);
      expect(event.target.alt).toBe(component.placeholderAltText);
      expect(component.imgClass).toBe('test-class placeholder');
    });

  });
});
