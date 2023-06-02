import * as fs from 'fs';
import { Processor } from "../../compilation/Processor";
import { Property } from '../../compilation/PropertyHolder';

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

export class SaveTextfileProcessor extends Processor<string, string> {

    public static readonly SAVE_FILENAME: Property<string> = new Property<string>("kico.save.filename", "src-gen");

    getId(){
        return "kico.save"
    }

    getName(){
        return "Save Textfile"
    }

    process() {
        const model = this.getModel();
        
        fs.writeFileSync(this.getFilename(), model, { flag:'w' })
    }

    setFilename(s: string): void {
        this.setProperty(SaveTextfileProcessor.SAVE_FILENAME, s)
    }

    getFilename():string {
        return this.getProperty(SaveTextfileProcessor.SAVE_FILENAME)!
    }
}