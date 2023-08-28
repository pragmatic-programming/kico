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

import { Environment } from "./Environment";
import { System, isSystemEntryProcessor, SystemEntryProcessor, SystemEntrySystem } from "./System";
import { Processor } from "./Processor";

export class CompilationContext {

    system: System;
    environment: Environment;
    startEnvironment: Environment;
    processors: Processor<any,any>[];

    constructor(system: System) {
        this.system = system;
        this.environment = new Environment();
        this.startEnvironment = this.environment;
        this.processors = [];

        this.populate();
    }

    protected populate() {
        this.populateEntries(this.system);
    }

    protected populateEntries(system: System) {
        for (const entry of system.entries) {
            if (isSystemEntryProcessor(entry)) {
                const processorType = (entry as SystemEntryProcessor).processor;
                this.processors.push(new processorType());
            } else {
                const systemReference = (entry as SystemEntrySystem).system;
                this.populateEntries(systemReference);
            }
        }
    }    

    compile() {
        this.startEnvironment = this.environment;
        this.processors[0].environment = this.environment.clone();
        
        for (let i = 0; i < this.processors.length; i++) {
            let processor = this.processors[i];
            this.environment = processor.environment;

            processor.process();

            if (i < this.processors.length - 1) {
                this.processors[i + 1].environment = processor.environment.clone();
                this.processors[i + 1].environment.shiftSourceModel();
            }
        }

    }

    getResult(): any {
        return this.environment.getResult();
    }

    loadResultAsModel(): void {
        this.environment.setProperty(Environment.SOURCE_MODEL, this.getResult());
    }
}
