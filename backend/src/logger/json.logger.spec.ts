import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger<unknown>;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send log message to console.log in JSON format', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('hello');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('hello');
    expect(parsed.optionalParams).toEqual([]);
    expect(parsed.timestamp).toBeDefined();
  });

  it('should send error message to console.error in JSON format', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('something went wrong');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('something went wrong');
    expect(parsed.optionalParams).toEqual([]);
    expect(parsed.timestamp).toBeDefined();
  });

  it('should send warn message to console.warn in JSON format', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('be careful');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('warn');
    expect(parsed.message).toBe('be careful');
    expect(parsed.optionalParams).toEqual([]);
    expect(parsed.timestamp).toBeDefined();
  });

  it('should include optional params in JSON output', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('hello', 'context', { id: 1 });

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const loggedValue = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedValue);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('hello');
    expect(parsed.optionalParams).toEqual(['context', { id: 1 }]);
    expect(parsed.timestamp).toBeDefined();
  });
});
