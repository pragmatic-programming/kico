import { createCompilationContextFromProcessors } from "../../src/compilation/Compile";
import { Processor } from "../../src/compilation/Processor";
import { Property } from "../../src/compilation/PropertyHolder";

class DynamicProcessor extends Processor<any, any> {

    public static readonly DYNAMIC_COUNTER: Property<number> = new Property<number>("processor.dynamic.counter", () => 0);

    public getId() {
        return "dynamic";
    }

    public getName() {
        return "Dynamic";
    }

    public async process() {
        const context = this.getCompilationContext();

        let counter = this.getProperty(DynamicProcessor.DYNAMIC_COUNTER);
        counter++;
        this.setProperty(DynamicProcessor.DYNAMIC_COUNTER, counter);

        if (counter < 10) {
            context.appendProcessor(DynamicProcessor);
        }
    }
}

test("dynamicCompilation", async () => {
    const context = createCompilationContextFromProcessors("Hello World!", DynamicProcessor);
    await context.compile();

    expect(context).toBeDefined();
    expect(context.processors.length).toBe(10);

    const environments = context.getEnvironments();

    expect(environments.length).toBe(10);
    expect(environments[0].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(1);
    expect(environments[1].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(2);
    expect(environments[2].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(3);
    expect(environments[3].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(4);
    expect(environments[4].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(5);
    expect(environments[5].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(6);
    expect(environments[6].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(7);
    expect(environments[7].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(8);
    expect(environments[8].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(9);
    expect(environments[9].getProperty(DynamicProcessor.DYNAMIC_COUNTER)).toBe(10);
});
