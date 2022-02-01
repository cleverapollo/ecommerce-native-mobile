import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogService, StubLogService } from '@core/services/log.service';
import { WISH_ERROR_IMAGE_ASSET_URL, WISH_PLACEHOLDER_IMAGE_ASSET_URL } from '@core/ui.constants';
import { IonicModule } from '@ionic/angular';

import { WishImageComponent } from './wish-image.component';

describe('ImageComponent', () => {
  let component: WishImageComponent;
  let fixture: ComponentFixture<WishImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishImageComponent ],
      providers: [
        {
          provide: LogService,
          useClass: StubLogService
        },
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WishImageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.src).toBe(WISH_PLACEHOLDER_IMAGE_ASSET_URL);
    expect(component.isLoading).toBeTruthy();
    expect(component.imgClass).toBe('hide');
    expect(component.imgStyles).toEqual({});
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
  
      expect(event.target.src).toBe(WISH_ERROR_IMAGE_ASSET_URL);
      expect(event.target.alt).toBe('');
      expect(component.imgClass).toBe('show');
      expect(component.isLoading).toBeFalsy();
    });

    it('adds a css class to the placeholder image', () => {
      component.src = "https://www.example.de/image.jpg";
      component.alt = "Example description";
      component.imgClass = 'test-class';

      fixture.detectChanges();
      component.onError(event);

      expect(event.target.src).toBe(WISH_ERROR_IMAGE_ASSET_URL);
      expect(event.target.alt).toBe('');
      expect(component.imgClass).toBe('test-class show');
      expect(component.isLoading).toBeFalsy();
    });

  });
});
