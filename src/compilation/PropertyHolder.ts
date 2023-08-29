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

export class Property<T> {
    id: string;
    defaultValue: T;

    constructor(id: string, defaultValue: T) {
        this.id = id;
        this.defaultValue = defaultValue;
    };
}


export class PropertyHolder {

    protected properties: { [key: string]: any };

    constructor() {
        this.properties = {};
    }

    setProperty<T>(property: Property<T>, value: T) {
        if (value === null) {
            this.properties[property.id] = property.defaultValue;
        } else {
            this.properties[property.id] = value;
        }
    };

    setPropertyString(id: string, value: string): void {
        this.properties[id] = value;
    }

    setPropertyNumber(id: string, value: number): void {
        this.properties[id] = value;
    }   
    
    setPropertyBoolean(id: string, value: boolean): void {
        this.properties[id] = value;
    }      

    setPropertyAny(id: string, value: any): void {
        this.properties[id] = value;
    }      

    getProperty<T>(property: Property<T>): T {
        if (property.id in this.properties) {
            return this.properties[property.id];
        } else {
            return property.defaultValue;
        }
    }

    getPropertyAny(id: string): any {
        return this.properties[id];
    }

    copy(propertyHolder: PropertyHolder): PropertyHolder {
        var newHolder = new PropertyHolder();

        for (const k in propertyHolder) {
            newHolder.properties[k] = this.properties[k];
        }

        return newHolder;
    }

    public getProperties(): { [key: string]: any } {
        return this.properties;
    }
}
