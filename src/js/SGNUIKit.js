/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

//require('./i18n/SGNi18n');
//import('../addons/jQuery/jquery.js');
//import SGNi18n from './i18n/SGNi18n';
import('./i18n/SGNi18n.js');
import('../css/fonts/FontAwesome6Free/js/all.min.js');
import('../css/fonts/FontAwesome6Free/js/v4-shims.min.js');
import('./helpers/helpers.js');
import('./addons/addons.js');
import('../addons/addons.js');
import('./components/components.js');

//export { SGNi18n };

//let i18n = new SGNi18n();

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

