import { Environment, Identity, Rot13 } from "../../../src";
import { Sum } from "../../../src/processors/misc/Sum";
import {BFInterpreter} from "../../../src/processors/misc/BFInterpreter";

test('process', () => {
    // given
    const bfInterpreter = new BFInterpreter();
    const sourceModel = ">++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<+" +
        "+.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-]<+."
    bfInterpreter.environment.setProperty(Environment.MODEL, sourceModel);
    
    // when
    bfInterpreter.process()
    
    // then
    expect(bfInterpreter.environment.getResult()).toBe("Hello, World!")
});
