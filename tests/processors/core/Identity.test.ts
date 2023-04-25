import { Environment, Identity } from "../../../src";

test('process', () => {
    //given
    const identity = new Identity();
    const sourceModel = "sourceModel"
    identity.environment.setProperty(Environment.MODEL, sourceModel);
    //when
    identity.process()
    //then
    expect(identity.environment.getResult()).toBe(sourceModel)
});
