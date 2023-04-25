/********************************************************************************
 * Copyright (c) 2022 ssm.
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
import { ConsoleLog } from "../io/ConsoleLog";
import { Environment } from "../../compilation/Environment";

/*
    * This processor sums up all numbers in the model.
    * The model is an array of numbers.
    * The result is a number.
    * 
    * Example:
    *   Input: [1,2,3]
    *   Output: 6
    */
export class Sum extends Processor<number[], number> {

    getId(){
        return "kico.sum";
    }

    getName(){
        return "Sum";
    }

    process() {
        let model = this.environment.getProperty(Environment.SOURCE_MODEL) as number[];
        if (process.argv.length > 2) {
            model = process.argv[2].slice(1, -1).split(",").map(n => parseInt(n));
        }
        const sum = Array.from(model).reduce(
            (accumulator, currentValue) => accumulator + currentValue, 0
        )
        this.setModel(sum);
    }
}