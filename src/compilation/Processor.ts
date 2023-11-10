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

import { CompilationContext } from "./CompilationContext";
import { Environment } from "./Environment";
import { Property } from "./PropertyHolder";
import { Status, StatusType } from "./Status";

export class Processor<Source, Target> {

    environment: Environment;
    preProcessors: typeof Processor<any, any>[];
    postProcessors: typeof Processor<any, any>[];

    constructor() {
        this.environment = new Environment();
        this.preProcessors = [];
        this.postProcessors = [];

        if (this.getId() == "") throw new Error("Processor must have an id");
        if (this.getName() == "") throw new Error("Processor must have a name");
    }

    getId(): string { return ""; }

    getName(): string { return ""; }

    process() {};

    protected getProperty<T>(property: Property<T>): T {
        return this.environment.getProperty(property);
    }

    protected setProperty<T>(property: Property<T>, value: T) {
        this.environment.setProperty(property, value);
    }  
    
    protected setPropertyUnsafe<T>(property: Property<T>, value: any) {
        this.environment.setPropertyAny(property.id, value);
    }

    protected getSourceModel(): Source {
        return this.getProperty(Environment.SOURCE_MODEL) as Source;
    }

    protected getTargetModel(): Source {
        return this.getProperty(Environment.MODEL) as Source;
    }

    protected setTargetModel(model: Target) {
        this.setProperty(Environment.MODEL, model);
    }

    protected getModel(): Source {
        return this.getProperty(Environment.MODEL) as Source;
    }

    protected setModel(model: Target) {
        this.setProperty(Environment.MODEL, model);
    }  

    protected getCompilationContext():CompilationContext {
        const compilationContext = this.getProperty(Environment.CONTEXT);
        
        if (compilationContext === null) {
            throw new Error("A processor tried to retrieve its context, but does not have one.");
        }

        return compilationContext;
    }

    public addPreProcessor(processorType: typeof Processor<any, any>) {
        this.preProcessors.push(processorType);
    }

    public addPostProcessor(processorType: typeof Processor<any, any>) {
        this.postProcessors.push(processorType);
    }

    public getPreProcessors(): typeof Processor<any, any>[] {
        return this.preProcessors;
    }

    public getPostProcessors(): typeof Processor<any, any>[] {
        return this.postProcessors;
    }

    public getStatus(): Status {
        return this.environment.getProperty(Environment.STATUS);
    }

    public addSuccess(message: string) {
        this.getStatus().add(StatusType.SUCCESS, message);
    }

    public addWarning(message: string) {
        this.getStatus().add(StatusType.WARNING, message);
    }

    public addError(message: string) {
        this.getStatus().add(StatusType.ERROR, message);
    }

}