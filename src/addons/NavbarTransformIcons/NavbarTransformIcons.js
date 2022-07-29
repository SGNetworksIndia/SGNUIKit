/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

var anchor = document.querySelectorAll('.nav-transformBtn');
[].forEach.call(anchor, function(anchor) {
	var open = (anchor.classList.contains('close'));
	anchor.onclick = function(event) {
		//event.preventDefault();
		if(!open) {
			this.classList.add('close');
			open = true;
		} else {
			this.classList.remove('close');
			open = false;
		}
	}
});