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
import { Property } from "./PropertyHolder";

export class Processor<Source, Target> {

    environment: Environment;

    constructor() {
        this.environment = new Environment();
    }

    getId(): string { return ""; }

    getName(): string { return ""; }

    process() {};

    protected getProperty<T>(property: Property<T>): T | undefined {
        return this.environment.getProperty(property);
    }

    protected setProperty<T>(property: Property<T>, value: T) {
        this.environment!.setProperty(property, value);
    }  
    
    protected setPropertyUnsafe<T>(property: Property<T>, value: any) {
        this.environment!.setPropertyAny(property.id, value);
    }

    protected getModel(): Source {
        return this.getProperty(Environment.SOURCE_MODEL) as Source;
    }

    protected setModel(model: Target) {
        this.setProperty(Environment.MODEL, model);
    }
}