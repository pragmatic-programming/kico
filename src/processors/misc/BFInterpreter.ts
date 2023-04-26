/********************************************************************************
 * Copyright (c) 2023 ssm.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Processor } from "../../compilation/Processor";

export class BFInterpreter extends Processor<string, string> {

    getId() {
        return "kico.bf.interpreter";
    }

    getName() {
        return "BF Interpreter";
    }

    process() {
        this.setModel(this.interpret(this.getModel(), Array.from({ length: 65536 }, () => 0), 0, 0));
    }

    interpret(program: string, memory: number[], programPtr: number, memoryPtr: number): string {
        var output = "";

        while (programPtr < program.length) {
            let command = program[programPtr];
            switch (command) {
                case '>':
                    memoryPtr++;
                    break;
                case '<':
                    memoryPtr--;
                    break;
                case '+':
                    memory[memoryPtr]++;
                    break;
                case '-':
                    memory[memoryPtr]--;
                    break;
                case '.':
                    output += String.fromCharCode(memory[memoryPtr]);
                    break;
                case '[':
                    if (memory[memoryPtr] == 0) {
                        let depth = 1;
                        while (depth > 0) {
                            programPtr++;
                            if (program[programPtr] == '[') {
                                depth++;
                            }
                            else if (program[programPtr] == ']') {
                                depth--;
                            }
                        }
                    }
                    break;
                case ']':
                    if (memory[memoryPtr] != 0) {
                        let depth = 1;
                        while (depth > 0) {
                            programPtr--;
                            if (program[programPtr] == ']') {
                                depth++;
                            }
                            else if (program[programPtr] == '[') {
                                depth--;
                            }
                        }
                    }
                    break;
            }
            programPtr++;

        }
        return output;
    }
}