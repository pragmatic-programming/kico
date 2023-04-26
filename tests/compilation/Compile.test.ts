import {compileProcessesorAndReturnResult, createCompilationContextFromProcessors, Identity} from "../../src";

test("createCompilationContextFromProcessors", () => {
    //given
    const sourceModel = "sourceModel";
    //when
    const context = createCompilationContextFromProcessors(sourceModel, Identity);
    context.compile();
    //then
    expect(context.getResult()).toBe(sourceModel);
});

test("compileProcessesorAndReturnResult", () => {
    //given
    const expectedSourceModel = "sourceModel";
    const properties = {foo: "bar"};
    //when
    const actualSourceModel = compileProcessesorAndReturnResult(expectedSourceModel, properties, Identity);
    //then
    expect(actualSourceModel).toBe(expectedSourceModel);
});
