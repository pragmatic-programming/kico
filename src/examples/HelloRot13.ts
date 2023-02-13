import { createCompilationContextFromProcessors } from "../compilation/Compile";
import { ConsoleLog } from "../processors/ConsoleLog";
import { Rot13 } from "../processors/Rot13";

const context = createCompilationContextFromProcessors("Hello Rot13!", Rot13, ConsoleLog);
context.compile();
context.loadResultAsModel();
context.compile();
