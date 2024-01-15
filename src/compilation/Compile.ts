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
import { createSystem, System } from "./System";
import { Environment } from "./Environment";
import { Processor } from "./Processor";
import { ExternalWrapperProcessor } from "../processors/core/ExternalWrapperProcessor";
import { KicoRegistry } from "./Registry";

export function createCompilationContext(sourceModel: any, system: System): CompilationContext {
    const context = new CompilationContext(system);
    context.environment.setProperty(Environment.ORIGINAL_MODEL, sourceModel);
    context.environment.setProperty(Environment.SOURCE_MODEL, sourceModel);
    context.environment.setProperty(Environment.MODEL, sourceModel);

    return context;
}

export function createCompilationContextFromProcessors(sourceModel: any, ...processors: typeof Processor<any, any>[]): CompilationContext {
    return createCompilationContext(sourceModel, createSystem("kico.system.auto", ...processors));
}

export function createCompilationContextFromRegistry(sourceModel: any, ...ids: string[]): CompilationContext {
    const processors: typeof Processor<any, any>[] = [];
    for (const id of ids) {
        const processorType = KicoRegistry.getProcessor(id);
        if (!processorType) {
            throw new Error(`Processor with id ${id} was not found in registry.`);
        }
        processors.push(processorType);
    }
    return createCompilationContext(sourceModel, createSystem("kico.system.auto", ...processors));
}

export function compileProcessesorAndReturnResult(sourceModel: any, properties: { [key: string]: any }, ...processors: typeof Processor<any, any>[]): Promise<any> {
    let cc = createCompilationContextFromProcessors(sourceModel, ...processors);
    for (const key in properties) {
        cc.environment.setPropertyAny(key, properties[key]);
    }
    cc.compile();
    return cc.environment.getResult();
}

export function compileExternalProcessesorAndReturnResult(sourceModel: any, properties: { [key: string]: any }, processClass: any): Promise<any>  {
    let cc = createCompilationContextFromProcessors([ExternalWrapperProcessor], sourceModel);
    for (var key in properties) {
        cc.environment.setPropertyAny(key, properties[key]);
    }
    cc.environment.setProperty(ExternalWrapperProcessor.EXTERNAL_PROCESS, processClass);
    cc.environment.setProperty(ExternalWrapperProcessor.EXTERNAL_PROPERTIES, properties);
    cc.compile();
    return cc.environment.getResult();
}
