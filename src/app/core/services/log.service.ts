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
    const logMessage = LogService.createLogMessage(message, '🟣');
    logger && additional?.length > 0 ? logger.trace(logMessage, additional) : logger.trace(logMessage);
  }

  debug(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = LogService.createLogMessage(message, '🐞');
    logger && additional?.length > 0 ? logger.debug(logMessage, additional) : logger.debug(logMessage);
  }

  info(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = LogService.createLogMessage(message, '🟢');
    logger && additional?.length > 0 ? logger.info(logMessage, additional) : logger.info(logMessage);
  }

  log(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = LogService.createLogMessage(message, '🟢');
    logger && additional?.length > 0 ? logger.log(logMessage, additional) : logger.log(logMessage);
  }

  warn(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = LogService.createLogMessage(message, '🟡');
    logger && additional?.length > 0 ? logger.warn(logMessage, additional) : logger.warn(logMessage);
  }

  error(message: any, ...additional: any[]): void {
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = LogService.createLogMessage(message, '🔴');
    logger && additional?.length > 0 ? logger.error(logMessage, additional) : logger.error(logMessage);
  }

  fatal(message: any, ...additional: any[]): void {
    if (this) {
      this.ngxLogger ? this.ngxLogger.fatal(message, additional) : console.error(message, additional);
    }
  }

  private static createLogMessage(message: any, emoji: string) {
    let errorMessage = message;
    if (typeof errorMessage === 'string') {
      errorMessage = `${emoji} ${message}`;
    }
    return errorMessage;
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
