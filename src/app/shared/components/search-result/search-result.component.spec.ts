import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishImageComponentFake } from '@test/components/wish-image.component.mock';
import { SearchResultComponent } from './search-result.component';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultComponent, WishImageComponentFake],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
