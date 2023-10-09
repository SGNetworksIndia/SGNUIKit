/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

SUKR(function() {
	const anchor = document.querySelectorAll('.nav-transformBtn'),
	      navbar = document.querySelectorAll('.navbar-collapse');
	[].forEach.call(anchor, function(anchor) {
		let open = (anchor.classList.contains('close'));
		anchor.onclick = function(event) {
			//event.preventDefault();
			if(!open) {
				this.classList.add('close');
				if(navbar !== undefined) {
					navbar[0].classList.add('open');
				}
				open = true;
			} else {
				this.classList.remove('close');
				if(navbar !== undefined) {
					navbar[0].classList.remove('open');
				}
				open = false;
			}
		}
	});
});
