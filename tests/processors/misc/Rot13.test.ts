import { Environment, Identity, Rot13 } from "../../../src";
import { Sum } from "../../../src/processors/misc/Sum";

test('process', () => {
    // given
    const rot = new Rot13();
    const sourceModel = "Hello Rot13!"
    rot.environment.setProperty(Environment.MODEL, sourceModel);
    
    // when
    rot.process()
    
    // then
    expect(rot.environment.getResult()).toBe("Uryyb Ebg13!")
});
