import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { FirebaseService } from './firebase.service';
import { Logger } from './log.service';
import { PlatformService } from './platform.service';
import { PlatformMockService } from './platform.service.mock';

describe('FirebaseService', () => {

  const angularFireAuthMock = {};
  const nativeAuthMock = {};
  const logger = {};
  const platformService: PlatformMockService = new PlatformMockService();

  let service: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: platformService },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: FirebaseAuthentication, useValue: nativeAuthMock },
        { provide: Logger, useValue: logger }
      ]
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
