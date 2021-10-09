import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

interface Logger {
  trace(message: any, ...additional: any[]): void;
  debug(message: any, ...additional: any[]): void;
  info(message: any, ...additional: any[]): void;
  log(message: any, ...additional: any[]): void;
  warn(message: any, ...additional: any[]): void;
  error(message: any, ...additional: any[]): void;
  fatal(message: any, ...additional: any[]): void;
}

@Injectable({
  providedIn: 'root'
})
export class LogService implements Logger {

  constructor(private ngxLogger: NGXLogger) { }

  get logger(): NGXLogger | Console {
    return this.ngxLogger ? this.ngxLogger : console;
  }

  trace(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.trace(message, additional) : logger.trace(message);
  }

  debug(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.debug(message, additional) : logger.debug(message);
  }

  info(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.info(message, additional) : logger.info(message);
  }

  log(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.log(message, additional) : logger.log(message);
  }

  warn(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.warn(message, additional) : logger.warn(message);
  }

  error(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    logger && additional?.length > 0 ? logger.error(message, additional) : logger.error(message);
  }

  fatal(message: any, ...additional: any[]): void {
    if (this) {
      this.ngxLogger ? this.ngxLogger.fatal(message, additional) : console.error(message, additional);
    }
  }
}

export class StubLogService implements Logger {
  trace(message: any, ...additional: any[]): void {
  }
  debug(message: any, ...additional: any[]): void {
  }
  info(message: any, ...additional: any[]): void {
  }
  log(message: any, ...additional: any[]): void {
  }
  warn(message: any, ...additional: any[]): void {
  }
  fatal(message: any, ...additional: any[]): void {
  }
  error(message) {
  }
}
