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
    if (!this) {
      return console;
    }
    return this.ngxLogger ? this.ngxLogger : console;
  }

  private static createLogMessage(message: any, emoji: string) {
    let errorMessage = message;
    if (typeof errorMessage === 'string') {
      errorMessage = `${emoji} ${message}`;
    } else if (typeof errorMessage === 'object') {
      errorMessage = `${emoji} ${JSON.stringify(message)}`;
    }
    return errorMessage;
  }

  trace(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🟣');
    this.logger && additional?.length > 0 ? this.logger.trace(logMessage, additional) : this.logger.trace(logMessage);
  }

  debug(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🐞');
    this.logger && additional?.length > 0 ? this.logger.debug(logMessage, additional) : this.logger.debug(logMessage);
  }

  info(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🟢');
    this.logger && additional?.length > 0 ? this.logger.info(logMessage, additional) : this.logger.info(logMessage);
  }

  log(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🟢');
    this.logger && additional?.length > 0 ? this.logger.log(logMessage, additional) : this.logger.log(logMessage);
  }

  warn(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🟡');
    this.logger && additional?.length > 0 ? this.logger.warn(logMessage, additional) : this.logger.warn(logMessage);
  }

  error(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    const logMessage = Logger.createLogMessage(message, '🔴');
    this.logger && additional?.length > 0 ? this.logger.error(logMessage, additional) : this.logger.error(logMessage);
  }

  fatal(message: any, ...additional: any[]): void {
    if (!this) {
      return;
    }
    if (!this.isEnabled) {
      return;
    }
    if (this) {
      this.ngxLogger ? this.ngxLogger.fatal(message, additional) : console.error(message, additional);
    }
  }
}
