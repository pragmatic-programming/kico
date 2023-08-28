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

export class Snapshots {
    public static SNAPSHOT_TAG: Property<string> = new Property<string>("kico.snapshots.tag", "");

    public environments : Environment[] = [];
    public workingEnvironment : Environment = new Environment();
    public workingTag : string = "";

    public setModel(model: Object) {
        this.workingEnvironment.setProperty(Environment.MODEL, model);
        this.workingEnvironment.setProperty(Snapshots.SNAPSHOT_TAG, this.workingTag);
    }

    public snapshotEnvironment(environment: Environment): void {
        this.environments.push(environment);
    }

    public snapshot(): void;
    public snapshot(model: Object): void;

    public snapshot(model?: Object): void {
        if (model && model !== null) {
            this.setModel(model);
            this.snapshot();
        } else {
            this.snapshotEnvironment(this.workingEnvironment.clone());
        }
    }

    public setTag(tag: string): void {
        this.workingTag = tag;
    }

    public getLastEnvironment(): Environment {
        return this.environments[this.environments.length - 1];
    }

    // based on Jean Vincent's solution in SO
    // https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    public static equals(x: any, y: any): boolean {
        if ( x === y ) return true;
        if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      
        for ( var p in x ) {      
          if ( ! y.hasOwnProperty( p ) ) return false;
          if ( x[ p ] === y[ p ] ) continue;
          if ( typeof( x[ p ] ) !== "object" ) return false;
      
          if ( ! Snapshots.equals( x[ p ],  y[ p ] ) ) return false;
        }
      
        for ( p in y )
          if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
            return false;
      
        return true;
      }
}
