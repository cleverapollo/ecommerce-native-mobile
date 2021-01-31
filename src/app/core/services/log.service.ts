import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private ngxLogger: NGXLogger) { }

  get logger(): NGXLogger | Console {
    return this.ngxLogger ? this.ngxLogger : console;
  }

  trace(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.trace(message, additional) : this.logger.trace(message);
  }

  debug(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.debug(message, additional) : this.logger.debug(message);
  }

  info(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.info(message, additional) : this.logger.info(message);
  }

  log(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.log(message, additional) : this.logger.log(message);
  }

  warn(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.warn(message, additional) : this.logger.warn(message);
  }

  error(message: any, ...additional: any[]): void {
    this?.logger && additional?.length > 0 ? this.logger.error(message, additional) : this.logger.error(message);
  }

  fatal(message: any, ...additional: any[]): void {
    this?.ngxLogger ? this.ngxLogger.fatal(message, additional) : console.error(message, additional);
  }
}
