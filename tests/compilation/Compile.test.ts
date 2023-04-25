import { createCompilationContextFromProcessors, Identity } from "../../src";

test('createCompilationContextFromProcessors', () => {
    const context = createCompilationContextFromProcessors("sourceModel", Identity);
    context.compile()
    expect(context.getResult()).toBe("sourceModel")
});
