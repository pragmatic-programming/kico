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

class Environment extends PropertyHolder {

    public static readonly ORIGINAL_MODEL: Property<any> = new Property<any>("kico.originalModel", undefined);
    public static readonly SOURCE_MODEL: Property<any> = new Property<any>("kico.sourceModel", undefined);
    public static readonly MODEL: Property<any> = new Property<any>("kico.model", undefined);

    clone(): Environment {
        var newEnv = new Environment();
        
        for (const k in this.properties) {
            if (Array.isArray(this.properties[k])) {
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
            if (Array.isArray(array[i])) {
                newArray[i] = this.cloneArray(array[i]);
            } else if (typeof array[i] == "object" && array[i] !== null) {
                newArray[i] = this.cloneObject(array[i]);
            } else {
                newArray[i] = array[i];
            }
        }
        return newArray;
    }

    cloneObject(object: Object):Object {
        let newObj = {};
        for (const k in object) {
            if (Array.isArray(object[k])) {
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

}

export { Environment };