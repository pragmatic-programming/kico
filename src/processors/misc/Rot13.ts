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

import { Processor } from "../../compilation/Processor";

export class Rot13 extends Processor<string, string> {

    private static readonly CHARCODE_A = "A".charCodeAt(0);
    private static readonly CHARCODE_Z = "Z".charCodeAt(0);
    private static readonly CHARCODE_a = "a".charCodeAt(0);
    private static readonly CHARCODE_z = "z".charCodeAt(0);

    getId(){
        return "kico.rot13";
    }

    getName(){
        return "Rot13";
    }

    process() {
        const model = this.getModel();
        var s = "";

        for (let i = 0; i < model.length; i++) {
            let c = model.charCodeAt(i);
            if (c >= Rot13.CHARCODE_A && c <= Rot13.CHARCODE_Z) {
                c = (((c - Rot13.CHARCODE_A) + 13) % 26) + Rot13.CHARCODE_A;
            }
            else if (c >= Rot13.CHARCODE_a && c <= Rot13.CHARCODE_z) {
                c = (((c - Rot13.CHARCODE_a) + 13) % 26) + Rot13.CHARCODE_a;
            }
            s = s + String.fromCharCode(c);
        }

        this.setModel(s);
    }
}