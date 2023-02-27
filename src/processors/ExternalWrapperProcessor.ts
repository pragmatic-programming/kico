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

import { Processor } from "../compilation/Processor";
import { Property } from "../compilation/PropertyHolder";

export interface IExternalWrapperProcess {
    process(sourceModel: string, properties: {}): any;
}

export class ExternalWrapperProcessor extends Processor<any, any> {
     
    public static readonly EXTERNAL_PROPERTIES: Property<{}> = new Property<{}>("kico.externalWrapper.properties");
    public static readonly EXTERNAL_PROCESS: Property<any> = new Property<any>("kico.externalWrapper.process");

    getId(){
        return "kico.externalWrapper";
    }

    getName(){
        return "External Wrapper";
    }

    process() {
        this.setModel(
            (this.getProperty(ExternalWrapperProcessor.EXTERNAL_PROCESS) as IExternalWrapperProcess).process(
                this.getModel(), this.getProperty(ExternalWrapperProcessor.EXTERNAL_PROPERTIES)!
            )
        );
    }

    loadExternalProcess(process: any) {
      this.setProperty(ExternalWrapperProcessor.EXTERNAL_PROCESS, process);
    }
 }