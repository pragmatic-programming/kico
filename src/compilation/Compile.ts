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
import { System, createSystem } from "./System";
import { Environment } from "./Environment";
import { Processor } from "./Processor";
import { ExternalWrapperProcessor } from "../processors/ExternalWrapperProcessor";

function createCompilationContext(sourceModel: any, system: System): CompilationContext {
    const context = new CompilationContext(system);
    context.environment.setProperty(Environment.ORIGINAL_MODEL, sourceModel);
    context.environment.setProperty(Environment.SOURCE_MODEL, sourceModel);
    context.environment.setProperty(Environment.MODEL, sourceModel);

    return context;
}

function createCompilationContextFromProcessors(sourceModel: any, ...processors: typeof Processor<any, any>[]): CompilationContext {
    return createCompilationContext(sourceModel, createSystem("kico.system.auto", ...processors));
}

function compileProcessesorAndReturnResult(sourceModel: any, properties: {}, ...processors: typeof Processor<any, any>[]): any {
    let cc = createCompilationContextFromProcessors(sourceModel, ...processors);
    for (var key of Object.keys(properties)) {
        cc.environment.setPropertyAny(key, properties[key]);
    }
    cc.compile();
    return cc.environment.getResult();
}

function compileExternalProcessesorAndReturnResult(sourceModel: any, properties: {}, processClass: any) {
    let cc = createCompilationContextFromProcessors([ExternalWrapperProcessor], sourceModel);
    for (var key of Object.keys(properties)) {
        cc.environment.setPropertyAny(key, properties[key]);
    }
    cc.environment.setProperty(ExternalWrapperProcessor.EXTERNAL_PROCESS, processClass);
    cc.environment.setProperty(ExternalWrapperProcessor.EXTERNAL_PROPERTIES, properties);
    cc.compile();
    return cc.environment.getResult();
}

export { createCompilationContext, createCompilationContextFromProcessors, 
    compileProcessesorAndReturnResult, compileExternalProcessesorAndReturnResult };