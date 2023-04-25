import { createCompilationContextFromProcessors, Identity } from "../../src";

test('createCompilationContextFromProcessors', () => {
    //given
    let sourceModel = "sourceModel";
    //when
    const context = createCompilationContextFromProcessors(sourceModel, Identity);
    context.compile()
    //then
    expect(context.getResult()).toBe(sourceModel)
});
