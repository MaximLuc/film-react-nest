import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private normalizeValue(value: string): string {
    return value.replace(/\t/g, ' ').replace(/\n/g, ' ');
  }

  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
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

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
