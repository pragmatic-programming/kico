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
import { Status, StatusType } from "./Status";
import { ContinueOnError } from "./EnvironmentSettings";

export class CompilationContext implements KicoCloneable {

    system: System | null;
    environment: Environment;
    startEnvironment: Environment;
    processors: Processor<any, any>[];
    stageCounter: number;

    constructor(system: System) {
        this.system = system;
        this.environment = new Environment();
        this.environment.setProperty(Environment.CONTEXT, this);
        this.startEnvironment = this.environment;
        this.processors = [];
        this.stageCounter = 0;

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

    public appendProcessor<T extends { new(): Processor<any, any> }>(processorType: T): Processor<any, any> {
        const processor = new processorType();
        this.processors.push(processor);

        return processor;
    }

    async compileAsync() {
        this.startEnvironment = this.environment;
        this.processors[0].environment = this.environment.clone();

        // Using boomer loop here because the dynamic compilation can append processors.
        this.stageCounter = 0;
        while(this.stageCounter < this.processors.length) {
            let processor = this.processors[this.stageCounter];
            this.environment = processor.environment;

            processor.getPreProcessors().forEach(async (preProcessorType) => {
                const preProcessor = new preProcessorType();
                preProcessor.environment = processor.environment;
                if (preProcessor.isAsync()) {
                    await preProcessor.processAsync();
                } else {
                    preProcessor.process();
                }
            });

            if (processor.isAsync()) {
                await processor.processAsync();
            } else {
                processor.process();
            }

            if (this.environment.getProperty(Environment.CONTINUE_ON_ERROR) == ContinueOnError.STOP_AT_ONCE && this.environment.getStatus().hasErrors()) {
                this.stageCounter++;
                break;
            }

            processor.getPostProcessors().forEach(async (postProcessorType) => {
                const postProcessor = new postProcessorType();
                postProcessor.environment = processor.environment;
                if (postProcessor.isAsync()) {
                    await postProcessor.processAsync();
                } else {
                    postProcessor.process();
                }
            });

            this.stageCounter++;

            if (this.environment.getProperty(Environment.CONTINUE_ON_ERROR) == ContinueOnError.STOP_AFTER_STAGE && this.environment.getStatus().hasErrors()) break;

            if (this.stageCounter < this.processors.length) {
                this.processors[this.stageCounter].environment = processor.environment.clone();
                this.processors[this.stageCounter].environment.shiftSourceModel();
            }
        }

    }

    compile() {
        this.startEnvironment = this.environment;
        this.processors[0].environment = this.environment.clone();

        if (this.processors.some((processor) => processor.isAsync())) {
            throw new Error("Cannot compile synchronously when there are asynchronous processors.");
        }

        // Using boomer loop here because the dynamic compilation can append processors.
        this.stageCounter = 0;
        while(this.stageCounter < this.processors.length) {
            let processor = this.processors[this.stageCounter];
            this.environment = processor.environment;

            processor.getPreProcessors().forEach(async (preProcessorType) => {
                const preProcessor = new preProcessorType();
                preProcessor.environment = processor.environment;
                preProcessor.process();
            });

            processor.process();

            processor.getPostProcessors().forEach(async (postProcessorType) => {
                const postProcessor = new postProcessorType();
                postProcessor.environment = processor.environment;
                postProcessor.process();
            });

            this.stageCounter++;

            if (!this.environment.getProperty(Environment.CONTINUE_ON_ERROR) && this.environment.getStatus().hasErrors()) break;

            if (this.stageCounter < this.processors.length) {
                this.processors[this.stageCounter].environment = processor.environment.clone();
                this.processors[this.stageCounter].environment.shiftSourceModel();
            }
        }
    }

    getResult(): any {
        return this.environment.getResult();
    }


    loadResultAsModel(): void {
        this.environment.setProperty(Environment.SOURCE_MODEL, this.getResult());
    }

    getEnvironments(): Environment[] {
        const result : Environment[] = [];

        for (let i = 0; i < this.stageCounter; i++) {
            result.push(this.processors[i].environment);
        }

        return result;
    }

    getEnvironment(): Environment {
        return this.environment;
    }

    getStageCounter(): number {
        return this.stageCounter;
    }

    getStatus(): Status {
        return this.environment.getProperty(Environment.STATUS);
    }

    /* Retrieves the Status of the whole compilation chain. */
    getContextStatus(): StatusType {
        // if (this.getEnvironments().some((environment) => environment.getStatus().hasErrors())) return StatusType.ERROR;
        // if (this.getEnvironments().some((environment) => environment.getStatus().hasWarnings())) return StatusType.WARNING;
        // if (this.getEnvironments().some((environment) => environment.getStatus().hasSuccesses())) return StatusType.SUCCESS;
        // return StatusType.UNDEFINED;

        const environments = this.getEnvironments();
        let hasWarnings = false;
        let hasSuccesses = false;

        for (const environment of environments) {
            if (environment.getStatus().hasErrors()) {
                return StatusType.ERROR;
            }
            if (environment.getStatus().hasWarnings()) {
                hasWarnings = true;
            }
            else if (environment.getStatus().hasSuccesses()) {
                hasSuccesses = true;
            }
        }

        if (hasWarnings) {
            return StatusType.WARNING;
        }
        if (hasSuccesses) {
            return StatusType.SUCCESS;
        }
        return StatusType.UNDEFINED;
    }
}
