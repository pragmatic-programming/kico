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

import { KicoRegistry } from "../compilation/Registry";
import { AsyncIdentity } from "./core/AsyncIdentity";
import { Error } from "./core/Error";
import { ExternalWrapperProcessor } from "./core/ExternalWrapperProcessor";
import { Identity } from "./core/Identity";
import { Warning } from "./core/Warning";
import { Commandline } from "./io/Commandline";
import { ConsoleLog } from "./io/ConsoleLog";


// Core
KicoRegistry.registerType(AsyncIdentity);
KicoRegistry.registerType(Error);
KicoRegistry.registerType(ExternalWrapperProcessor);
KicoRegistry.registerType(Identity);
KicoRegistry.registerType(Warning);

// IO
KicoRegistry.registerType(Commandline);
KicoRegistry.registerType(ConsoleLog);