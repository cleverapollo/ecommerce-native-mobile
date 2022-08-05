import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class Logger {

  protected isEnabled(): boolean {
    return !environment.production;
  }

  constructor(private ngxLogger: NGXLogger) { }

  get logger(): NGXLogger | Console {
    return this.ngxLogger ? this.ngxLogger : console;
  }

  private static createLogMessage(message: any, emoji: string) {
    let errorMessage = message;
    if (typeof errorMessage === 'string') {
      errorMessage = `${emoji} ${message}`;
    }
    return errorMessage;
  }

  trace(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🟣');
    logger && additional?.length > 0 ? logger.trace(logMessage, additional) : logger.trace(logMessage);
  }

  debug(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🐞');
    logger && additional?.length > 0 ? logger.debug(logMessage, additional) : logger.debug(logMessage);
  }

  info(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🟢');
    logger && additional?.length > 0 ? logger.info(logMessage, additional) : logger.info(logMessage);
  }

  log(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🟢');
    logger && additional?.length > 0 ? logger.log(logMessage, additional) : logger.log(logMessage);
  }

  warn(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🟡');
    logger && additional?.length > 0 ? logger.warn(logMessage, additional) : logger.warn(logMessage);
  }

  error(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    let logger: NGXLogger | Console = console;
    if (this) {
      logger = this.logger;
    }
    const logMessage = Logger.createLogMessage(message, '🔴');
    logger && additional?.length > 0 ? logger.error(logMessage, additional) : logger.error(logMessage);
  }

  fatal(message: any, ...additional: any[]): void {
    if (!this.isEnabled) {
      return;
    }
    if (this) {
      this.ngxLogger ? this.ngxLogger.fatal(message, additional) : console.error(message, additional);
    }
  }
}
