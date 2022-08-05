import { Injectable } from "@angular/core";
import { Logger } from "./log.service";

@Injectable()
export class LoggerFake extends Logger {
    protected isEnabled(): boolean {
        return false;
    }
}