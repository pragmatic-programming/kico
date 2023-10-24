import { ExternalWrapperProcessor, IExternalWrapperProcess } from "../../../src";

class FakeExternalWrapperProcess implements IExternalWrapperProcess {
    private readonly result;

    constructor(result: string) {
        this.result = result
    }

    process(sourceModel: string, properties: {}): any {
        return this.result
    }
}

test('process', () => {
    // given
    const externalWrapperProcessor = new ExternalWrapperProcessor();
    const result = "result";
    externalWrapperProcessor.loadExternalProcess(new FakeExternalWrapperProcess(result));
   
    // when
    externalWrapperProcessor.process()
   
    // then
    expect(externalWrapperProcessor.environment.getResult()).toBe(result)
});
