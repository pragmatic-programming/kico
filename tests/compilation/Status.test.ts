import { createCompilationContextFromProcessors, Environment, Identity, StatusType } from "../../src";
import { Warning } from "../../src/processors/core/Warning";
import { Error } from "../../src/processors/core/Error";

test("statusSuccess", () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity);
    context.compileAsync();

    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(true);
    expect(context.getStatus().hasSuccesses()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.SUCCESS);
});

test("statusWarning", () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Warning);
    context.compileAsync();

    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(true);
    expect(context.getStatus().hasWarnings()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.WARNING);
});

test("statusError", () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Error, Warning);
    context.compileAsync();

    expect(context.getEnvironments().length).toBe(2);
    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(false);
    expect(context.getStatus().hasWarnings()).toBe(false);
    expect(context.getEnvironment().getStatus().hasErrors()).toBe(true);
    expect(context.getStatus().hasErrors()).toBe(true);
    expect(context.getContextStatus()).toBe(StatusType.ERROR);
});

test("statusErrorContinue", () => {
    const context = createCompilationContextFromProcessors("Hello World!", Identity, Error, Warning);
    context.getEnvironment().setProperty(Environment.CONTINUE_ON_ERROR, true);
    context.compileAsync();

    expect(context.getEnvironments().length).toBe(3);
    expect(context.getEnvironment().getStatus().hasSuccesses()).toBe(false);
    expect(context.getStatus().hasSuccesses()).toBe(false);
    expect(context.getEnvironment().getStatus().hasWarnings()).toBe(true);
    expect(context.getStatus().hasWarnings()).toBe(true);
    expect(context.getEnvironment().getStatus().hasErrors()).toBe(false);
    expect(context.getStatus().hasErrors()).toBe(false);
    expect(context.getContextStatus()).toBe(StatusType.ERROR);
});
