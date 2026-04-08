import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger<unknown>;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send log message to console.log in TSKV format', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('hello');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggerValue = consoleSpy.mock.calls[0][0];
    expect(loggerValue).toContain('level=log');
    expect(loggerValue).toContain('message=hello');
    expect(loggerValue).toContain('timestamp=');
  });

  it('should send error message to console.error in TSKV format', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('something went wrong');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggerValue = consoleSpy.mock.calls[0][0];
    expect(loggerValue).toContain('level=error');
    expect(loggerValue).toContain('message=something went wrong');
    expect(loggerValue).toContain('timestamp=');
  });

  it('should send warn message to console.warn in TSKV format', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('be careful');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggerValue = consoleSpy.mock.calls[0][0];
    expect(loggerValue).toContain('level=warn');
    expect(loggerValue).toContain('message=be careful');
    expect(loggerValue).toContain('timestamp=');
  });

  it('should include optional params in TSKV output', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('hello', 'context');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggerValue = consoleSpy.mock.calls[0][0];
    expect(loggerValue).toContain('level=log');
    expect(loggerValue).toContain('message=hello');
    expect(loggerValue).toContain('context');
    expect(loggerValue).toContain('timestamp=');
  });
});
