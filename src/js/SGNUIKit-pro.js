/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

import('./i18n/SGNi18n.js');
import('./helpers/string.js');
import('./helpers/DynamicEvents.js');
import('./helpers/helpers.js');
import('../css/fonts/FontAwesome5Pro/js/all.min.js');
import('../css/fonts/FontAwesome5Pro/js/v4-shims.min.js');
import('../addons/addons.js');
import('./addons/addons.js');
import('./components/components.js');

async function getSGNI18nInstance(callback) {
	return new Promise((resolve, reject) => {
		const timeoutHandler = setTimeout(function() {
			if(checkIntervalHandler)
				clearInterval(checkIntervalHandler);
		}, 10000);

		const checkIntervalHandler = setInterval(function() {
			if(window.SGNUIKitReady) {
				if(timeoutHandler)
					clearTimeout(timeoutHandler);
				clearInterval(checkIntervalHandler);
				const c = new SGNi18n();

				resolve(c);
			}
		}, 100);
	});
}

