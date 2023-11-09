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
import { isSystemEntryProcessor, System, SystemEntry, SystemEntryProcessor, SystemEntrySystem } from "./System";
import { Processor } from "./Processor";
import { KicoCloneable } from "./KicoCloneable";

export class CompilationContext implements KicoCloneable {

    system: System | null;
    environment: Environment;
    startEnvironment: Environment;
    processors: Processor<any, any>[];

    constructor(system: System) {
        this.system = system;
        this.environment = new Environment();
        this.environment.setProperty(Environment.CONTEXT, this);
        this.startEnvironment = this.environment;
        this.processors = [];

        this.populate();
    }

    public isMutable(): boolean {
        return false;
    }

    public clone(): KicoCloneable {
        return this;
    }

    protected populate() {
        if (this.system !== null) {
            this.populateEntries(this.system);
        }
    }

    protected populateEntries(system: System) {
        for (const entry of system.entries) {
            this.appendSystemEntry(entry);
        }
    }

    public appendSystemEntry(entry: SystemEntry) {
        if (isSystemEntryProcessor(entry)) {
            const processorType = (entry as SystemEntryProcessor).processor;
            this.processors.push(new processorType());
        } else {
            const systemReference = (entry as SystemEntrySystem).system;
            this.populateEntries(systemReference);
        }
    }

    public appendProcessor(processorType: typeof Processor): Processor<any, any> {
        const processor = new processorType();
        this.processors.push(processor);

        return processor;
    }

    async compile() {
        this.startEnvironment = this.environment;
        this.processors[0].environment = this.environment.clone();

        // Using boomer loop here because the dynamic compilation can append processors.
        let i = 0;
        while (i < this.processors.length) {
            let processor = this.processors[i];
            this.environment = processor.environment;

            processor.getPreProcessors().forEach(async (preProcessorType) => {
                const preProcessor = new preProcessorType();
                preProcessor.environment = processor.environment;
                await preProcessor.process();
            });
            await processor.process();
            processor.getPostProcessors().forEach(async (postProcessorType) => {
                const postProcessor = new postProcessorType();
                postProcessor.environment = processor.environment;
                await postProcessor.process();
            });

            if (i < this.processors.length - 1) {
                this.processors[i + 1].environment = processor.environment.clone();
                this.processors[i + 1].environment.shiftSourceModel();
            }

            i++;
        }

    }

    getResult(): any {
        return this.environment.getResult();
    }

    loadResultAsModel(): void {
        this.environment.setProperty(Environment.SOURCE_MODEL, this.getResult());
    }

    getEnvironments(): Environment[] {
        const result: Environment[] = [];

        for (const processor of this.processors) {
            result.push(processor.environment);
        }

        return result;
    }
}
