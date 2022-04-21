(function(callback) {
	function getScriptURL() {
		const script = document.currentScript || document.querySelector('script[src*="SGNUIKit.js"]');
		return script.src;
	}
	//const script = document.currentScript || document.querySelector('script[src*="SGNUIKit.js"]');

	let i;
	const url = getScriptURL().split("/").slice(0, -2).join("/") + '/addons/';
	const scripts = [
		'ContextJS/context.min.js',
		'DataTables/datatables.min.js',
		'datepicker/bootstrap-datepicker.min.js',
		'iziToast/iziToast.min.js',
		'iziToast/iziToast.easy.js',
		'NavbarTransformIcons/NavbarTransformIcons.js',
		//'Marquee/marquee.js',
		'noty/noty.js',
		'noty/noty.init.js',
		'SGNGeoData/SGNGeoData.min.js',
		'SGNTimePicker/SGNTimePicker.min.js',
		'SweetAlert2/sweetalert2.all.min.js',
		'VelocityJS/velocity.min.js'
	];
	const styles = [];
	let filesloaded = 0;
	const filestoload = scripts.length + styles.length;
	for(i = 0; i < scripts.length; i++) {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url + scripts[i];
		script.onload = function() {
			filesloaded++;
			finishLoad();
		};
		document.head.appendChild(script);
	}
	for(i = 0; i < styles.length; i++) {
		const style = document.createElement('link');
		style.rel = 'stylesheet';
		style.href = styles[i];
		style.type = 'text/css';
		style.onload = function() {
			filesloaded++;
			finishLoad();
		};
		document.head.appendChild(style);
	}

	function finishLoad() {
		if(filesloaded === filestoload && typeof callback === 'function') {
			callback();
		}
	}
})();
