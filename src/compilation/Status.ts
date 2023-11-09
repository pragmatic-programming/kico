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

import { KicoCloneable } from "./KicoCloneable";

export enum StatusType {
    UNDEFINED = "UNDEFINED",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export class StatusEntry {
    status: StatusType;
    message: string;

    constructor(status: StatusType = StatusType.UNDEFINED, message: string = "") {
        this.status = status;
        this.message = message;
    }
}

export class Status implements KicoCloneable {
    status: StatusEntry[];

    constructor() {
        this.status = [];
    }

    isMutable(): boolean {
        return true;
    }

    clone(): KicoCloneable {
        return new Status();
    }

    add(status: StatusType, message: string) {
        this.status.push(new StatusEntry(status, message));
    }

    getEntries(): StatusEntry[] {
        return this.status;
    }

    getErrors(): StatusEntry[] {
        return this.status.filter((entry) => entry.status == StatusType.ERROR);
    }

    getWarnings(): StatusEntry[] {
        return this.status.filter((entry) => entry.status == StatusType.WARNING);
    }

    getSuccesses(): StatusEntry[] {
        return this.status.filter((entry) => entry.status == StatusType.SUCCESS);
    }

    hasErrors(): boolean {
        return this.getErrors().length > 0;
    }

    hasWarnings(): boolean {
        return this.getWarnings().length > 0;
    }

    hasSuccesses(): boolean {
        return this.getSuccesses().length > 0;
    }
}