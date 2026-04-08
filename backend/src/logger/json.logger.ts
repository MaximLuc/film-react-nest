import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger<T = unknown> implements LoggerService {
  private formatMessage(
    level: string,
    message: T,
    ...optionalParams: T[]
  ): string {
    return JSON.stringify({
      level,
      message,
      optionalParams,
      timestamp: new Date().toISOString(),
    });
  }

  log(message: T, ...optionalParams: T[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: T, ...optionalParams: T[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: T, ...optionalParams: T[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: T, ...optionalParams: T[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: T, ...optionalParams: T[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
