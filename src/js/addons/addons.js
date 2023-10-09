/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

require('./BBCodesParser.js');
require("./SGNCodeSnippet.js");
require('./SGNConsole.js');
require("./SGNDataTables.js");
require("./SGNMultiPage.js");
require('./SGNSnackbar.js');
const console = (window || self).console = new SGNConsole(true, true);
