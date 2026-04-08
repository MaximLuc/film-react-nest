import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger<T = unknown> implements LoggerService {
  private normalizeValue(value: string): string {
    return value.replace(/\t/g, ' ').replace(/\n/g, ' ');
  }

  private formatMessage(
    level: string,
    message: T,
    ...optionalParams: T[]
  ): string {
    const parts = [`level=${level}`];
    switch (typeof message) {
      case 'string':
        parts.push(`message=${this.normalizeValue(message)}`);
        break;
      case 'object':
        parts.push(`message=${this.normalizeValue(JSON.stringify(message))}`);
        break;
      default:
        parts.push(`message=${this.normalizeValue(String(message))}`);
        break;
    }
    if (optionalParams.length > 0) {
      parts.push(`meta=${this.normalizeValue(JSON.stringify(optionalParams))}`);
    }

    parts.push(`timestamp=${new Date().toISOString()}`);
    return parts.join('\t');
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
