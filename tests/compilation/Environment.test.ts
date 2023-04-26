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

