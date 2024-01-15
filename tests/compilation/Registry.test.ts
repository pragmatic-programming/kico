import { createCompilationContextFromRegistry } from "../../src";

test("createCompilationContextFromRegistry", () => {
    const sourceModel = "Hello World!";
    const context = createCompilationContextFromRegistry(sourceModel, "kico.identity");
    context.compile();
    expect(context.getResult()).toBe(sourceModel);
});

test("createCompilationContextFromRegistryMissing", () => {
    const sourceModel = "Hello World!";
    try {
        const context = createCompilationContextFromRegistry(sourceModel, "kico.identity.missing");
        context.compile();
        expect(true).toBe(false); // should not be reached
    } catch (e) {
        expect((e as Error).message).toBe("Processor with id kico.identity.missing was not found in registry.");
    }
});
