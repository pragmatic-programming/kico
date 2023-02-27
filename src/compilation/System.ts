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

type SystemEntry = SystemEntryProcessor | SystemEntrySystem;

interface SystemEntryProcessor {
    processor: typeof Processor;
}

interface SystemEntrySystem {
    system: System;
}

function isSystemEntryProcessor(systemEntry: SystemEntry): boolean {
    return 'processor' in systemEntry;
}

class System {
    id: string;
    entries: SystemEntry[];

    constructor(id: string, entries: SystemEntry[]) {
        this.id = id;
        this.entries = entries;
    }

    clone(): System {
        return new System(this.id, this.entries);
    }
}

function createSystem(id: string, ...processors: typeof Processor<any, any>[]): System {
    let systemEntries: SystemEntry[] = [];
    for (const p of processors) {
        systemEntries.push({ processor: p } as SystemEntryProcessor)
    }

    return new System(id, systemEntries);
}

export { System, SystemEntry, SystemEntryProcessor, SystemEntrySystem, isSystemEntryProcessor, createSystem };