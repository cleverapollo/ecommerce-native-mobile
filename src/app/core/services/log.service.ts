import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private logger: NGXLogger) { }

  trace(message: any, ...additional: any[]): void {
    this.logger ? this.logger.trace(message, additional) : console.trace(message, additional);
  }

  debug(message: any, ...additional: any[]): void {
    this.logger ? this.logger.debug(message, additional) : console.debug(message, additional);
  }

  info(message: any, ...additional: any[]): void {
    this.logger ? this.logger.info(message, additional) : console.info(message, additional);
  }

  log(message: any, ...additional: any[]): void {
    this.logger ? this.logger.log(message, additional) : console.log(message, additional);
  }

  warn(message: any, ...additional: any[]): void {
    this.logger ? this.logger.warn(message, additional) : console.warn(message, additional);
  }

  error(message: any, ...additional: any[]): void {
    this.logger ? this.logger.error(message, additional) : console.error(message, additional);
  }

  fatal(message: any, ...additional: any[]): void {
    this.logger ? this.logger.fatal(message, additional) : console.error(message, additional);
  }
}
