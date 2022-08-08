/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

const args = {};
const argv = process.argv;

for(let i = 2; i < argv.length; i++) {
	const v = argv[i].replace('--', '');
	i++;
	args[v] = argv[i];
}

module.exports = args;