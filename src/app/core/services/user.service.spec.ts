import { TestBed } from '@angular/core/testing';
import { Facebook } from '@ionic-native/facebook/ngx';

import { UserService } from './user.service';

describe('UserService', () => {

  const facebook: any = {};
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Facebook, useValue: facebook }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
