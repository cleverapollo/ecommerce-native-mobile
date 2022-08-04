import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { FirebaseService } from './firebase.service';
import { DefaultPlatformService, PlatformMockService } from './platform.service';

describe('FirebaseService', () => {

  const angularFireAuthMock = {};
  const nativeAuthMock = {};

  let service: FirebaseService;
  const platformService: PlatformMockService = new PlatformMockService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DefaultPlatformService, useValue: platformService },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: FirebaseAuthentication, useValue: nativeAuthMock }
      ]
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
