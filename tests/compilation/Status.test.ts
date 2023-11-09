import { createCompilationContextFromProcessors, Environment, Identity, StatusType } from "../../src";
import { Warning } from "../../src/processors/core/Warning";
import { Error } from "../../src/processors/core/Error";

test("statusSuccess", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity);
    await context.compile();

    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(true);
    expect(context.getStatus().hasSuccesses()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.SUCCESS);
});

test("statusWarning", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Warning);
    await context.compile();

    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(true);
    expect(context.getStatus().hasWarnings()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.WARNING);
});

test("statusError", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Error, Warning);
    await context.compile();

    expect(context.getEnvironments().length).toBe(2);
    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(false);
    expect(context.getStatus().hasWarnings()).toBe(false);
    expect(context.getEnvironment().getStatus().hasErrors()).toBe(true);
    expect(context.getStatus().hasErrors()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.ERROR);
});

test("statusErrorContinue", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Error, Warning);
    context.getEnvironment().setProperty(Environment.CONTINUE_ON_ERROR, true);
    await context.compile();

    expect(context.getEnvironments().length).toBe(3);
    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(true);
    expect(context.getStatus().hasWarnings()).toBe(true);
    expect(context.getEnvironment().getStatus().hasErrors()).toBe(false);
    expect(context.getStatus().hasErrors()).toBe(false);
    expect(context.getContextStatus()).toBe(StatusType.ERROR);
});
