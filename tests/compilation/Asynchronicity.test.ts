import { createCompilationContextFromProcessors } from "../../src/compilation/Compile";
import { StatusType } from "../../src/compilation/Status";
import { AsyncIdentity } from "../../src/processors/core/AsyncIdentity";
import { Identity } from "../../src/processors/core/Identity";

test("compileAsynchronously", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", AsyncIdentity);
    await context.compileAsync();

    expect(context.getResult()).toBe("Hello World!");
    expect(context.getContextStatus()).toBe(StatusType.SUCCESS);
});

test("compileAsynchronouslyMixed", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, AsyncIdentity);
    await context.compileAsync();

    expect(context.getResult()).toBe("Hello World!");
    expect(context.getContextStatus()).toBe(StatusType.SUCCESS);
});

test("compileAsynchronouslyInWrongContext", () => {
    const context = createCompilationContextFromProcessors("Hello World!", AsyncIdentity);
    const t = () => context.compile();

    expect(t).toThrowError();
});

test("compileAsynchronouslyInWrongContext2", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", AsyncIdentity);
    const t = () => context.compile();

    expect(t).toThrowError();
});