import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { LogService } from './log.service';

describe('LogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerTestingModule
    ],
  }));

  it('should be created', () => {
    const service: LogService = TestBed.inject(LogService);
    expect(service).toBeTruthy();
  });
});
