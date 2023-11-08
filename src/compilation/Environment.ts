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

import { PropertyHolder, Property } from "./PropertyHolder";
import { isKicoCloneable } from "./KicoCloneable";
import { CompilationContext } from "./CompilationContext";
import { Status } from "./Status";

export class Environment extends PropertyHolder {

    public static readonly ORIGINAL_MODEL: Property<any> = new Property<any>("kico.originalModel", () => undefined);
    public static readonly SOURCE_MODEL: Property<any> = new Property<any>("kico.sourceModel", () => undefined);
    public static readonly MODEL: Property<any> = new Property<any>("kico.model", () => undefined);
    public static readonly CONTEXT: Property<CompilationContext | null> = new Property<CompilationContext | null>("kico.compilationContext", () => null);
    public static readonly CONTINUE_ON_ERROR: Property<boolean> = new Property<boolean>("kico.continueOnError", () => false);
    public static readonly STATUS: Property<Status> = new Property<Status>("kico.status", () => new Status());

    clone(): Environment {
        var newEnv = new Environment();
        
        for (const k in this.properties) {
            if (isKicoCloneable(this.properties[k])) {
                newEnv.properties[k] = this.properties[k].clone();
            } else if (Array.isArray(this.properties[k])) {
                newEnv.properties[k] = this.cloneArray(this.properties[k]);
            } else if (typeof this.properties[k] == "object" && this.properties[k] !== null) {
                newEnv.properties[k] = this.cloneObject(this.properties[k]);
            } else {
                newEnv.properties[k] = this.properties[k];
            }
        } 

        return newEnv;
    }

    cloneArray(array: any[]): any[] {
        let newArray = [] as any[];
        for (let i = 0; i < array.length; i++) {
            if (isKicoCloneable(array[i])) {
                newArray[i] = array[i].clone();
            } else if (Array.isArray(array[i])) {
                newArray[i] = this.cloneArray(array[i]);
            } else if (typeof array[i] == "object" && array[i] !== null) {
                newArray[i] = this.cloneObject(array[i]);
            } else {
                newArray[i] = array[i];
            }
        }
        return newArray;
    }

    cloneObject(object: { [key: string]: any }): { [key: string]: any } {
        let newObj: { [key: string]: any } = {};
        for (const k in object) {
            if (isKicoCloneable(object[k])) {
                newObj[k] = object[k].clone();
            } else if (Array.isArray(object[k])) {
                newObj[k] = this.cloneArray(object[k]);
            } else if (typeof object[k] == "object" && object[k] !== null) {
                newObj[k] = this.cloneObject(object[k]);
            } else {
                newObj[k] = object[k];
            }
        }
        return newObj;
    }

    shiftSourceModel() {
        this.setProperty(Environment.SOURCE_MODEL, this.getProperty(Environment.MODEL));
    }

    getResult(): any {
        return this.getProperty(Environment.MODEL);
    }

    getStatus(): Status {
        return this.getProperty(Environment.STATUS);
    }
}
