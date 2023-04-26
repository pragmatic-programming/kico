import { Environment, Identity } from "../../../src";
import { Sum } from "../../../src/processors/misc/Sum";

test('process', () => {
    // given
    const sum = new Sum();
    const sourceModel = [1,2]
    sum.environment.setProperty(Environment.SOURCE_MODEL, sourceModel);
    // when
    sum.process()
    // then
    expect(sum.environment.getResult()).toBe(3)
});
