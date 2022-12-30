/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

//import('./i18n/SGNi18n.js');
//import('./helpers/helpers.js');
//import('./helpers/loader.js');
//import('./addons/addons.js');
//import('../addons/addons.js');


const until = (predicateFn) => {
	const poll = (done) => (predicateFn() ? done() : setTimeout(() => poll(done), 500));
	return new Promise(poll);
};

async function pause(v) {
	while(v < 100)
		await new Promise(resolve => setTimeout(resolve, 1000));
}

function loop(lightboxImages, index) {
	if(index === lightboxImages.length) return;

	lightboxImages[index].onload = function() {
		console.log('image ' + index + ' loaded.');
		loop(lightboxImages, ++index);
	};
}

(async function(precallback) {
	const title = document.title;
	if(title !== undefined)
		document.title = 'Loading...';

	if(window.jQuery)
		$.holdReady(true);

	(() => {
		const css = `/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

.has-preloader,
.has-preloader * {
\t--sgn-background: #fff;
\t--sgn-preloader-stripes-width: 6px;
\t--sgn-preloader-circles-width: 44px;
\t--sgn-preloader-circles-height: 22px;
\t--sgn-preloader-circles-margin: 1px;
\t--sgn-preloader-circles-radius: 6px;
}

@media all and (prefers-color-scheme: dark) {
\t.has-preloader,
\t.has-preloader * {
\t--sgn-background: #000;
\t}
}

body {
\tmargin: 0;
}

.has-preloader {
\toverflow: hidden !important;
}

.sgn-preloader {
\tpadding: 0;
\twidth: 100%;
\theight: 100%;
\tbackground-color: var(--sgn-background);
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tposition: absolute;
\tz-index: 999999;
}


.sgn-preloader > .preloader {
\tposition: relative;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
}

.sgn-preloader > .preloader > .spinner {
\tanimation: rotate 10s infinite linear;
\tposition: relative;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
\twidth: 100%;
\theight: 100%;
}


.sgn-preloader > .preloader > img {
\twidth: 100%;
\theight: 100%;
\tmargin: var(--sgn-preloader-circles-margin);
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tposition: relative;
\ttop: 50%;
\tleft: 50%;
}
.sgn-preloader > .preloader > .spinner > img {
\twidth: calc(var(--sgn-preloader-circles-width));
\theight: calc(var(--sgn-preloader-circles-width));
\tmargin: var(--sgn-preloader-circles-margin);
}
.sgn-preloader > .preloader > .spinner > i {
\tanimation: rotate 3s infinite cubic-bezier(0.09, 0.6, 0.8, 0.03);
\ttransform-origin: 50% 100% 0;
\tposition: absolute;
\tdisplay: inline-flex;
\tjustify-content: center;
\talign-items: center;
\ttop: 50%;
\tleft: 50%;
\tborder: solid var(--sgn-preloader-stripes-width) transparent;
\tborder-bottom: none;
}
.sgn-preloader > .preloader > .spinner > i:nth-child(1) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.3, 0.12, 0.03);
\twidth: var(--sgn-preloader-circles-width);
\theight: var(--sgn-preloader-circles-height);
\tmargin-top: calc(0px - var(--sgn-preloader-circles-height));
\tmargin-left: calc(0px - var(--sgn-preloader-circles-height));
\tborder-color: #2172b8;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(2) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.6, 0.24, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2));
\theight: calc(var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)));
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin))));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + (var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin))));
\tborder-color: #18a39b;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(3) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 0.9, 0.36, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2));
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2)));
\tborder-color: #82c545;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(4) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.2, 0.48, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 1.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 3)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 3)));
\tborder-color: #f8b739;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(5) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.5, 0.6, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 4)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 4)));
\tborder-color: #f06045;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 4) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(6) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 1.8, 0.72, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 2.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 5)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 5)));
\tborder-color: #ed2861;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 5) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(7) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 2.1, 0.84, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 6)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 6)));
\tborder-color: #c12680;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 6) + var(--sgn-preloader-circles-radius));
}
.sgn-preloader > .preloader > .spinner > i:nth-child(8) {
\t-moz-animation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\t-webkit-animation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\tanimation-timing-function: cubic-bezier(0.09, 2.4, 0.96, 0.03);
\twidth: calc(var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7);
\theight: calc(var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 3.5);
\tmargin-top: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 7)));
\tmargin-left: calc(0px - (var(--sgn-preloader-circles-height) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 7)));
\tborder-color: #5d3191;
\tborder-top-left-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7) + var(--sgn-preloader-circles-radius));
\tborder-top-right-radius: calc((var(--sgn-preloader-circles-width) + ((var(--sgn-preloader-stripes-width) + var(--sgn-preloader-circles-margin)) * 2) * 7) + var(--sgn-preloader-circles-radius));
}

@-moz-keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}
@-webkit-keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}
@keyframes rotate {
\tto {
\t\ttransform: rotate(360deg);
\t}
}


`;
		const head  = document.head || document.getElementsByTagName('head')[0],
			  style = document.createElement('style');

		head.appendChild(style);
		style.type = 'text/css';
		style.id = 'sgn-uikit-styles';
		if(style.styleSheet) {
			// This is required for IE8 and below.
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		//console.log(style);
	})();
	(function() {
		let preloaderElem = document.createElement("div");
		preloaderElem.className = 'sgn-preloader';
		let preloader = `\t\t\t<div class="preloader">\n`;
		//preloader += `\t\t\t\t<img src="<?=$public_imgAssets;?>icons/xsmall.png">\n`;
		preloader += `\t\t\t\t<div class="spinner">\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t\t<i></i>\n`;
		preloader += `\t\t\t\t</div>\n`;
		preloader += `\t\t\t</div>\n`;
		preloader += `\t\t</div>\n`;

		preloaderElem.innerHTML = preloader;

		window.onload = function() {
			document.body.className += ' has-preloader';
			document.body.insertBefore(preloaderElem, document.body.firstChild);
		}
	})();

	const currentScript = document.currentScript || document.querySelector('script[src*="SGNUIKit.loader.js"]');
	const url = currentScript.src.split("/").slice(0, -2).join("/") + '/';
	const preload = [
		'js/i18n/SGNi18n.js'
	];
	/*if(!window.jQuery || jQuery === undefined)
		preload.push('addons/jQuery/jQuery.min.js');*/

	let filesloaded = 0;
	const filestoload = preload.length;

	for(let i = 0; i < filestoload; i++) {
		const script = document.createElement('script');
		script.src = url + preload[i];
		script.async = false;
		script.defer = false;
		currentScript.after(script);
		if(i === 0)
			script.id = 'sgn-preload-end';

		/*await new Promise(resolve => {
			script.onload = function() {
				filesloaded++;
				script.onload = null;
				resolve();
			};
		}).then(r => finishLoad());*/
		script.onload = function() {
			filesloaded++;
			script.onload = null;
			finishLoad();
		};
	}

	async function finishLoad() {
		let progress = Math.round((filesloaded * 100) / filestoload);

		await new Promise(resolve => {
			if(filesloaded >= filestoload) {
				resolve();
			}
		}).then(function() {
			import('./helpers/helpers.js');
			$('head > title').text(title);
			if(typeof precallback === 'function' && progress === 100)
				precallback();
		});
	}
})(function() {
	(async function(callback) {
		const sgnuikitScript = document.currentScript || document.querySelector('script[src*="SGNUIKit.loader.js"]');
		const currentScript = document.getElementById('sgn-preload-end') || sgnuikitScript;

		function getScriptURL() {
			return sgnuikitScript.src;
		}

		const url = getScriptURL().split("/").slice(0, -2).join("/") + '/';

		setTimeout(function() {
			startLoad();
		}, 5000);

		function startLoad() {
			const scripts = [
				'css/fonts/FontAwesome5Pro/js/all.js',
				'css/fonts/FontAwesome5Pro/js/v4-shims.js',

				"addons/CKEditor5/ckeditor.js",
				"addons/ContextJS/context.js",
				//'addons/DataTables/datatables.min.js',
				"addons/datepicker/bootstrap-datepicker.min.js",
				"addons/iziToast/iziToast.js",
				"addons/iziToast/iziToast.easy.js",
				"addons/NavbarTransformIcons/NavbarTransformIcons.js",
				///addons/'Marquee/marquee.js',
				"addons/noty/noty.js",
				"addons/noty/noty.init.js",
				"addons/PrismJS/prism.js",
				"addons/SGNGeoData/SGNGeoData.js",
				"addons/SGNTimePicker/SGNTimePicker.js",
				"addons/SweetAlert2/sweetalert2.all.js",
				"addons/VelocityJS/velocity.js",

				"js/i18n/SGNi18n.js",

				"js/helpers/String.js",
				"js/helpers/DynamicEvents.js",
				"js/helpers/helpers.js",

				"js/addons/BBCodesParser.js",
				"js/addons/SGNConsole.js",
				"js/addons/SGNSnackbar.js",
				"js/addons/SGNDataTables.js",
				"js/addons/SGNCodeSnippet.js",
			];
			const styles = [
				'css/SGNUIKit-pro.css',
			];
			let filesloaded = 0,
				lastScript  = currentScript;
			const filestoload = scripts.length + styles.length;

			function loadScript(i) {
				if(i === scripts.length) return;

				const script = document.createElement('script');
				//script.type = 'text/javascript';
				script.src = url + scripts[i];
				script.onload = function() {
					filesloaded++;
					script.onload = null;
					//console.log(`LOADED SCRIPT: ${script.src}`, `${i}/${filestoload}`);
					finishLoad();
					loadScript(++i);
				};
				lastScript.after(script);
				lastScript = lastScript.nextElementSibling || currentScript;
			}

			function loadStyle(i) {
				if(i === scripts.length) return;

				const style = document.createElement('link');
				style.rel = 'stylesheet';
				style.href = url + styles[i];
				//style.type = 'text/css';
				style.onload = function() {
					filesloaded++;
					style.onload = null;
					finishLoad();
					loop(++i);
				};
				currentScript.after(style);
			}

			loadScript(0);
			loadStyle(0);

			async function finishLoad() {
				const progress = Math.round((filesloaded * 100) / filestoload);

				if(typeof callback === 'function') {
					callback(filesloaded, filestoload, progress);
				}
			}
		}
	})(async function(loaded, total, progress) {
		if(progress === 100) {
			import('./i18n/SGNi18n.js');
			import('./components/components.js');
			window.SGNUIKitReady = true;

			const left = document.querySelector('style[data-cke="true"]');
			if(left !== null)
				left.parentNode.removeChild(left);

			setTimeout(function() {
				$.holdReady(false);
				jQuery.ready();

				$('body').children('.sgn-preloader').fadeOut(2000, function() {
					$('body').children('.sgn-preloader').remove();
					$('body').removeClass('has-preloader');
				});
			}, 5000);

		}
	});
});


/*(async() => {
	console.log("waiting for variable");
	while(progress < 100) // define the condition as you like
		await new Promise(resolve => setTimeout(resolve, 1000));
	console.log("variable is defined");
})();*/
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

				/*if(typeof callback === 'function')
					callback(c);*/
				resolve(c);
			}
		}, 100);
	});
}

