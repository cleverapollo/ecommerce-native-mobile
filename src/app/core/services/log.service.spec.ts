import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Logger } from './log.service';

describe('Logger', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerTestingModule
    ],
  }));

  it('should be created', () => {
    const service: Logger = TestBed.inject(Logger);
    expect(service).toBeTruthy();
  });
});
