import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase.service';
import { DefaultPlatformService, PlatformMockService } from './platform.service';

describe('FirebaseService', () => {

  let service: FirebaseService;
  const platformService: PlatformMockService = new PlatformMockService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DefaultPlatformService, useValue: platformService }
      ]
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
