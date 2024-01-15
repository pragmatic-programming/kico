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

import { Processor } from "./Processor";

export class KicoRegistry {
    
    static processorRegistry: Map<string, typeof Processor<any, any>> = new Map<string, typeof Processor<any, any>>();

    public static register(id: string, processor: typeof Processor<any, any>) {
        KicoRegistry.processorRegistry.set(id, processor);
    }

    public static registerType(processor: typeof Processor<any, any>) {
        const processorInstance = new processor();
        KicoRegistry.processorRegistry.set(processorInstance.getId(), processor);
    }

    public static getProcessor(id: string): typeof Processor<any, any> | undefined {
        return KicoRegistry.processorRegistry.get(id);
    }

    public getProcessorIds(): string[] {
        return Array.from(KicoRegistry.processorRegistry.keys());
    }
}
