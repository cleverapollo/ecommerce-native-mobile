import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    });
  })

  it('should be created', () => {
    const service: NavigationService = TestBed.inject(NavigationService);
    expect(service).toBeTruthy();
  });
});
