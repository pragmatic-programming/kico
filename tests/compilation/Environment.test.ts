import {Environment} from "../../src";

test("clone", () => {
    //given
    const environment = new Environment();
    environment.setPropertyString("string", "string");
    environment.setPropertyBoolean("boolean", true);
    environment.setPropertyNumber("number", 1);
    environment.setPropertyAny("array", ["string", [], {}]);
    environment.setPropertyAny("object", {string: "string", array: [], object: {}});
    //when
    const cloned = environment.clone();
    //then
    expect(cloned).toEqual(environment);
});

test("shiftSourceModel", () => {
    //given
    const environment = new Environment();
    const value = "test";
    environment.setProperty(Environment.MODEL, value)
    const initialSourceModel = environment.getProperty(Environment.SOURCE_MODEL);
    expect(initialSourceModel).toBeUndefined();
    //when
    environment.shiftSourceModel();
    //then
    const sourceModel = environment.getProperty(Environment.SOURCE_MODEL);
    const model = environment.getProperty(Environment.MODEL);
    expect(sourceModel).toEqual(value);
    expect(model).toEqual(value);
});

test("getResult", () => {
    //given
    const environment = new Environment();
    const value = "test";
    environment.setProperty(Environment.MODEL, value)
    //when
    const result = environment.getResult();
    //then
    expect(result).toEqual(value);
});
