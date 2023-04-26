import { ConsoleLog, Environment } from "../../../src";

test('process', () => {
    // given
    const logSpy = jest.spyOn(console, 'log');
    const consoleLog = new ConsoleLog();
    const sourceModel = "sourceModel"
    consoleLog.environment.setProperty(Environment.SOURCE_MODEL, sourceModel);
    // when
    consoleLog.process()
    // then
    expect(logSpy).toHaveBeenCalledWith(sourceModel);
    logSpy.mockRestore();
});
