/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

window.logStopArt = stopArt => {
	const styles = [
		"background: linear-gradient(#333, #000)"
		, "border: 1px solid #3E0E02"
		, "color: red"
		, "display: block"
		, "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)"
		, "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset"
		, "text-align: center"
		, "font-weight: bold",
	].join(";");
	if(empty(stopArt)) {
		stopArt = "\n";
		stopArt += "                                                                                                \n";
		stopArt += "                                                                                                \n";
		stopArt += "     SSSSSSSSSSSSSSS           tttt                                                   !!!       \n";
		stopArt += "   SS:::::::::::::::S       ttt:::t                                                  !!:!!      \n";
		stopArt += "  S:::::SSSSSS::::::S       t:::::t                                                  !:::!      \n";
		stopArt += "  S:::::S     SSSSSSS       t:::::t                                                  !:::!      \n";
		stopArt += "  S:::::S             ttttttt:::::ttttttt        ooooooooooo    ppppp   ppppppppp    !:::!      \n";
		stopArt += "  S:::::S             t:::::::::::::::::t      oo:::::::::::oo  p::::ppp:::::::::p   !:::!      \n";
		stopArt += "   S::::SSSS          t:::::::::::::::::t     o:::::::::::::::o p:::::::::::::::::p  !:::!      \n";
		stopArt += "    SS::::::SSSSS     tttttt:::::::tttttt     o:::::ooooo:::::o pp::::::ppppp::::::p !:::!      \n";
		stopArt += "      SSS::::::::SS         t:::::t           o::::o     o::::o  p:::::p     p:::::p !:::!      \n";
		stopArt += "         SSSSSS::::S        t:::::t           o::::o     o::::o  p:::::p     p:::::p !:::!      \n";
		stopArt += "              S:::::S       t:::::t           o::::o     o::::o  p:::::p     p:::::p !!:!!      \n";
		stopArt += "              S:::::S       t:::::t    tttttt o::::o     o::::o  p:::::p    p::::::p  !!!       \n";
		stopArt += "  SSSSSSS     S:::::S       t::::::tttt:::::t o:::::ooooo:::::o  p:::::ppppp:::::::p            \n";
		stopArt += "  S::::::SSSSSS:::::S       tt::::::::::::::t o:::::::::::::::o  p::::::::::::::::p   !!!       \n";
		stopArt += "  S:::::::::::::::SS          tt:::::::::::tt  oo:::::::::::oo   p::::::::::::::pp   !!:!!      \n";
		stopArt += "   SSSSSSSSSSSSSSS              ttttttttttt      ooooooooooo     p::::::pppppppp      !!!       \n";
		stopArt += "                                                                 p:::::p                        \n";
		stopArt += "                                                                 p:::::p                        \n";
		stopArt += "                                                                p:::::::p                       \n";
		stopArt += "                                                                p:::::::p                       \n";
		stopArt += "                                                                p:::::::p                       \n";
		stopArt += "                                                                ppppppppp                       \n";
		stopArt += "                                                                                                \n";
		stopArt += "                                                                                                \n";
		stopArt += "                                                                                                \n";
		stopArt += "If you are not a developer, please close this panel by pressing F12 or CTRL-SHIFT-I (Windows). If someone told you to paste a block of code here to activate a feature, please don't do that as it may result in a punishable offense.\n";
	}

	Console.log("%c" + stopArt, styles);
};

/**
 * Check if a string is a <b><i>JSON</b></i> object/array or not.
 *
 * @param {string} str The string to check.
 *
 * @return {boolean} <b><i>TRUE</b></i> if the string is a <b><i>JSON</b></i> object/array, <b><i>FALSE</b></i> otherwise.
 *
 * @since 1.0.1
 * @version 1.0.1
 */
window.is_json = (str) => {
	try {
		JSON.parse(str);
	} catch(e) {
		return false;
	}
	return true;
};

/***
 * Parse a URL and return its components
 *
 * @param {string} url The URL to parse.
 * @param {string} [component=null] Specify one of <b>PHP_URL_SCHEME</b>, <b>PHP_URL_HOST</b>, <b>PHP_URL_PORT</b>, <b>PHP_URL_USER</b>, <b>PHP_URL_PASS</b>, <b>PHP_URL_PATH</b>, <b>PHP_URL_QUERY</b> or <b>PHP_URL_FRAGMENT</b> to retrieve just a specific URL component as a string (except when <b>PHP_URL_PORT</b> is given, in which case the return value
 * will be an int).
 * @return {{}|number|string|null|false} If the <b>component</b> parameter is omitted, an associative array is returned. At least one element will be present within the array.
 * <br>
 * Potential keys within this array are:
 * <br>
 * <b>scheme</b> - e.g. http
 * <br>
 * <b>host</b>
 * <br>
 * <b>port</b>
 * <br>
 * <b>user</b>
 * <br>
 * <b>pass</b>
 * <br>
 * <b>path</b>
 * <br>
 * <b>query</b> - after the question mark ?
 * <br>
 * <b>fragment</b> - after the hashmark #
 * <br><br>
 * If the component parameter is specified, <b>parse_url()</b> returns a string (or an int, in the case of <b>PHP_URL_PORT</b>) instead of an array. If the requested component doesn't exist within the given URL, null will be returned.
 * @since 1.0.1
 * @version 1.0.1
 */
window.parse_url = (url, component) => {
	/*eslint-disable-line camelcase
	 discuss at: https://locutus.io/php/parse_url/
	 original by: Steven Levithan (https://blog.stevenlevithan.com)
	 reimplemented by: Brett Zamir (https://brett-zamir.me)
	 input by: Lorenzo Pisani
	 input by: Tony
	 improved by: Brett Zamir (https://brett-zamir.me)
	 note 1: original by https://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	 note 1: blog post at https://blog.stevenlevithan.com/archives/parseuri
	 note 1: demo at https://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	 note 1: Does not replace invalid characters with '_' as in PHP,
	 note 1: nor does it return false with
	 note 1: a seriously malformed URL.
	 note 1: Besides function name, is essentially the same as parseUri as
	 note 1: well as our allowing
	 note 1: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
	 example 1: parse_url('https://user:pass@host/path?a=v#a')
	 returns 1: {scheme: 'https', host: 'host', user: 'user', pass: 'pass', path: '/path', query: 'a=v', fragment: 'a'}
	 example 2: parse_url('https://en.wikipedia.org/wiki/%22@%22_%28album%29')
	 returns 2: {scheme: 'https', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
	 example 3: parse_url('https://host.domain.tld/a@b.c/folder')
	 returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
	 example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar')
	 returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder', query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }*/
	let query;
	//const mode = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.mode') : undefined) || 'php'
	const mode = "php";
	const key = [
		"source",
		"scheme",
		"authority",
		"userInfo",
		"user",
		"pass",
		"host",
		"port",
		"relative",
		"path",
		"directory",
		"file",
		"query",
		"fragment",
	];
	// For loose, we added one optional slash to post-scheme to catch file:/// (should restrict this)
	let parser = {
		php: new RegExp([
			"(?:([^:\\/?#]+):)?",
			"(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?",
			"()",
			"(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)",
		].join("")),
		strict: new RegExp([
			"(?:([^:\\/?#]+):)?",
			"(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?",
			"((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)",
		].join("")),
		loose: new RegExp([
			"(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?",
			"(?:\\/\\/\\/?)?",
			"((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)",
			"(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))",
			"(?:\\?([^#]*))?(?:#(.*))?)",
		].join("")),
	};
	const m = parser[mode].exec(url);
	const uri = {};
	let i = 14;
	while(i--) {
		if(m[i]) {
			uri[key[i]] = m[i];
		}
	}
	if(component) {
		return uri[component.replace("PHP_URL_", "").toLowerCase()];
	}
	if(mode !== "php") {
		//const name = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.queryKey') : undefined) || 'queryKey'
		const name = "queryKey";
		parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
		uri[name] = {};
		query = uri[key[12]] || "";
		query.replace(parser, function($0, $1, $2) {
			if($1) {
				uri[name][$1] = $2;
			}
		});
	}
	delete uri.source;
	return uri;
};

/***
 * Get search query string from the url
 *
 * @param {string} url The URL to parse.
 * @return {{}} The parsed and found query strings as <b><i>JSON</i></b> object.
 *
 * @since 1.0.1
 * @version 1.0.1
 */
window.getUrlVars = url => {
	let hash,
	    json   = {},
	    hashes = url.slice(url.indexOf("?") + 1).split("&");
	for(let i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		json[hash[0]] = hash[1];
	}
	return json;
};

/***
 * Get an <b>SGNi18n</b> string identified by <b><i>key</i></b> and also if <b>SGNi18n</b> is used and initialized.
 *
 * @param {string} key The <b><i>key</i></b> to identify a <b>SGNi18n</b> object.
 * @param {string} fallback A <b><i>string</i></b> to use as fallback (in case the <b>SGNi18n</b> object could not be found).
 * @param {...any} args Any optional arguments to pass to concatenate in the found <b>SGNi18n</b> object.
 *
 * @returns {string} The processed i18n <b><i>string</i></b> or fallback <b><i>string</i></b>.
 *
 * @since 1.1.3
 * @version 1.1.4
 * @var i18n
 * @requires SGNi18n
 */
window.getI18nString = (key, fallback, ...args) => ((typeof i18n !== 'undefined' && i18n instanceof SGNi18n) ? i18n.getString(key, fallback, args) : fallback);

/***
 * Find the position of the first occurrence of a substring in a string
 *
 * @param {string} haystack The <b><i>string</i></b> to search in.
 * @param {string|number} needle The substring to search in the <b><i>haystack</i></b>.
 * @param {number} [offset = 0] If specified, search will start this number of characters counted from the beginning of the string. If the offset is negative, the search will start this number of characters counted from the end of the string.
 *
 * @returns {number|false} The position of where the needle exists relative to the beginning of the haystack string (independent of offset), <b><i>FALSE</i></b> if the needle was not found. Also note that string positions start at 0, and not 1.
 *
 * @since 1.1.3
 * @version 1.1.4
 */
window.strpos = (haystack, needle, offset) => {
	const i = (haystack + "").indexOf(needle + "", (offset || 0));
	//return i !== -1;
	return (i !== -1) ? i : false;
};

/***
 * Determine if a string contains a given substring
 *
 * @param {string} haystack The <b><i>string</i></b> to search in.
 * @param {string|number} needle The substring to search in the <b><i>haystack</i></b>.
 *
 * @returns {boolean} <b><i>TRUE</i></b> if needle is found in the haystack, <b><i>FALSE</i></b> otherwise.
 *
 * @since 1.1.4
 * @version 1.1.4
 */
window.str_contains = (haystack, needle) => {
	return ((haystack + "").indexOf(needle + "", 0) !== -1);
};

/***
 * Allow only numbers in a specific form field.
 *
 * @param {HTMLElement} f The <b><i>HTMLElement</i></b> to capture the event.
 * @param {UIEventInit} e The event object for the specified <b><i>HTMLElement</i></b> in <b><i>f</i></b>.
 *
 * @returns {boolean} <b><i>TRUE</i></b> if needle is found in the haystack, <b><i>FALSE</i></b> otherwise.
 *
 * @since 1.1.4
 * @version 1.1.2
 */
window.numbersOnly = (f, e) => {
	let key,
	    keychar;
	if(window.event)
		key = window.event.keyCode;
	else if(e)
		key = e.which;
	else
		return true;
	keychar = String.fromCharCode(key);
	//CONTROL KEYS
	if((key == null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
		return true;
	//NUMBER KEYS
	else if((("0123456789").indexOf(keychar) > -1))
		return true;
	//ONLY ONE DECIMAL POINT
	else if((keychar === ".")) {
		if(f.val().indexOf(keychar) > -1)
			return false;
	} else
		return false;
};


/**
 * This callback type is called `readFileCallback` and is displayed as a global symbol.
 *
 * @callback readFileCallback
 * @param {boolean} error
 * @param {JSON} data
 */
/**
 *
 * @param {jQuery} $el - The jQuery reference to HTML file input.
 * @param {readFileCallback} callback - The callback that handles the response.
 * @param {JSON} [data] - The form data.
 * @param {boolean} [stringify=true] - Stringify the finalized form data.
 */
window.readFile = function($el, callback, data, stringify = false) {
	if(typeof data === "boolean" && typeof stringify === "object") {
		const tmpData = data;
		data = stringify;
		stringify = tmpData;
	}

	const reader = new FileReader();
	const id = $el.attr("name") || $el.attr("id") || "files";
	const files = $el[0].files;

	let fdata = {};
	fdata = $.extend(fdata, data);

	if(files.length > 0) {
		$.each(files, function(i, c) {
			const $this = $(this),
			      file  = $this[0];
			if(file === undefined) {
				if(typeof callback === "function")
					callback(true, fdata);
			} else {
				fdata[id] = [];
				reader.addEventListener("loadend", function() {
					const obj = {
						"name": file.name,
						"lastModified": file.lastModified,
						"webkitRelativePath": file.webkitRelativePath,
						"size": file.size,
						"type": file.type,
						"data": reader.result.split(",", 2)[1],
					};
					const objJSON = JSON.stringify(obj);
					if(stringify)
						fdata[id].push(objJSON);
					else
						fdata[id].push(obj);

					if(typeof callback === "function")
						callback(false, fdata);
				}, false);

				reader.readAsDataURL(file);
			}
		});
	} else {
		if(typeof callback === "function")
			callback(true, fdata);
	}
};

/**
 *
 * @param {JSON} data - The form data to merge.
 * @param {jQuery} $fileInputs - The jQuery reference to HTML file inputs.
 * @param {readFileCallback} callback - The callback that handles the response.
 */
window.mergeFormData = function(data, $fileInputs, callback) {
	let fdata = {};
	fdata = $.extend(fdata, data);

	if($fileInputs.length > 0 && ($.isArray($fileInputs) || $fileInputs instanceof jQuery)) {
		if($.isArray($fileInputs)) {
			$fileInputs.forEach((c, i) => {
				$fileInputs[i].each(function(n) {
					const $this      = $(this),
					      $fileInput = $this;

					const name = $fileInput.attr("name") || $fileInput.attr("id");
					readFile($fileInput, (error, finalData) => {
						//fdata = finalData;
						if(typeof callback === "function")
							callback(error, finalData);
					}, fdata);
				});
			});
		} else {
			$fileInputs.each(function() {
				const $this      = $(this),
				      $fileInput = $this;

				const name = $fileInput.attr("name") || $fileInput.attr("id");
				readFile($fileInput, (error, finalData) => {
					//fdata = finalData;
					if(typeof callback === "function")
						callback(error, finalData);
				}, fdata);
			});
		}
	} else {
		if(typeof callback === "function")
			callback(true, fdata);
	}
};

/**
 *
 * @param {jQuery} $form - The jQuery reference to HTML form element.
 * @param {readFileCallback} callback - The callback that handles the response.
 */
window.getFormData = function($form, callback) {
	let fd = {};

	if($form.length > 0) {
		const inputs  = "input.form-control:not(sgn-select-input):not(sgn-control-search-input), select.form-control, textarea.form-control",
		      $inputs = $form.find(inputs);

		if($inputs.length > 0) {
			$inputs.each(function() {
				const $this    = $(this),
				      nodeName = ($this.prop("nodeName")) ? $this.prop("nodeName") : $this[0].nodeName,
				      type     = (nodeName === "INPUT") ? $this.attr("type").toLowerCase() : nodeName.toLowerCase(),
				      id       = $this.attr("name") || $this.attr("id"),
				      v        = (type === "checkbox" || type === "radio") ? $this.filter(":checked").val() : (type === "select") ? $this.find("option:selected").val() : $this.val();
				if(type === "file") {
					mergeFormData(fd, $this, (error, mergedData) => fd = mergedData);
				} else {
					fd[id] = v;
				}
			});

			if(typeof callback === "function")
				callback(true, fd);
		}
	}
};

/**
 *
 * Determine whether a variable is empty
 *
 * @param obj Variable to be checked
 * @param {boolean} [checkLength=false] If set to <b>TRUE</b>, this will check for zero-length objects as well.
 * @returns {boolean} <b>TRUE</b> if the <i>obj</i> does not exist or has a value that is empty but not equal to <i><b>zero</b></i>, <b>FALSE</b> otherwise.
 */
window.empty = (obj, checkLength = false) => (checkLength) ? (obj === undefined || obj === null || obj === "" || (obj.length && obj.length <= 0)) : (obj === undefined || obj === null || obj === "");

/***
 * Select an object which is not empty from the specified array of objects.
 *
 * @param obj The <b>array</b> of objects.
 *
 * @returns {jQuery|any} The non-empty object (if any), otherwise <b>undefined</b>.
 */
window.select = (...obj) => {
	if(!empty(obj)) {
		for(const k in obj) {
			const o = obj[k];

			if(!empty(o, true))
				return o;
		}
	}
};

window.escapeHTML = (str) => {
	const escapeChars = {
		"¢": "cent",
		"£": "pound",
		"¥": "yen",
		"€": "euro",
		"©": "copy",
		"®": "reg",
		"<": "lt",
		">": "gt",
		"\"": "quot",
		"&": "amp",
		"'": "#39",
	};

	let regexString = "[";
	for(const key in escapeChars) {
		regexString += key;
	}
	regexString += "]";

	const regex = new RegExp(regexString, "g");

	return str.replace(regex, function(m) {
		return "&" + escapeChars[m] + ";";
	});
};

window.unescapeHTML = (str) => {
	const htmlEntities = {
		nbsp: " ",
		cent: "¢",
		pound: "£",
		yen: "¥",
		euro: "€",
		copy: "©",
		reg: "®",
		lt: "<",
		gt: ">",
		quot: "\"",
		amp: "&",
		apos: "'",
	};
	return str.replace(/&([^;]+);/g, function(entity, entityCode) {
		let match;

		if(entityCode in htmlEntities) {
			return htmlEntities[entityCode];
			/*eslint no-cond-assign: 0*/
		} else if(match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
			return String.fromCharCode(parseInt(match[1], 16));
			/*eslint no-cond-assign: 0*/
		} else if(match = entityCode.match(/^#(\d+)$/)) {
			return String.fromCharCode(~~match[1]);
		} else {
			return entity;
		}
	});
};

window.getGeolocation = (e, element, callback) => {
	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	if(e instanceof Event)
		e.preventDefault();

	let $elem = e;
	if(e instanceof EventTarget || e instanceof HTMLElement || e instanceof jQuery)
		$elem = $(e);
	else if(e instanceof Event)
		$elem = $(e.target);
	const $sgnInput = $elem.parents('.sgn-input-wrapper');
	if($sgnInput.length > 0) {
		$elem = $sgnInput.children('.form-control');
	}
	$elem.showLoader();

	if(typeof element === 'string') {
		element = $(element);
	}

	navigator.geolocation.getCurrentPosition((pos) => {
		const coordinates = pos.coords,
		      timestamp   = pos.timestamp;
		const latitude         = coordinates.latitude,
		      longitude        = coordinates.longitude,
		      accuracy         = coordinates.accuracy, // in meters
		      altitude         = coordinates.altitude,
		      altitudeAccuracy = coordinates.altitudeAccuracy,
		      heading          = coordinates.heading,
		      speed            = coordinates.speed;
		const coords = `${latitude}, ${longitude}`;

		const defaultAPI = SGNUIKit.config.geocoding.defaultAPI;

		if(defaultAPI === 'osm' || defaultAPI === 'geonames') {
			const apiBase = SGNUIKit.config.urls.api[defaultAPI],
			      apiURL  = (defaultAPI === 'geonames') ? `${apiBase}countryCode` : `${apiBase}reverse`,
			      apiKey  = (defaultAPI === 'geonames') ? SGNUIKit.config.api.geonames : '';
			const opt = (defaultAPI === 'geonames') ? {
				lat: latitude,
				lon: longitude,
				type: 'JSON',
				username: apiKey || 'demo'
			} : {
				lat: latitude,
				lon: longitude,
				format: 'json',
			};
			$.getJSON(apiURL, opt, function(result) {
				//console.log(result);
				if(defaultAPI === 'osm') {
					const address  = result.address,
					      location = result.display_name;
					result = Object.assign(result, {'position': coordinates});
					setLocation(coords, result, location);
				} else {
					result = Object.assign(result, {'position': coordinates});
					setLocation(coords, result, location);
				}
			});
		} else {
			setLocation(coords, coordinates);
		}

		/*console.log('Your current position is:');
		 console.log(`Latitude : ${coordinates.latitude}`);
		 console.log(`Longitude: ${coordinates.longitude}`);
		 console.log(`More or less ${coordinates.accuracy} meters.`);*/
	}, (error) => {
		const code    = error.code,
		      message = error.message,
		      timeout = (options.timeout / 1000);

		console.warn(`GEOLOCATION: ERROR(${code}): ${message}`);

		const msg = (code === GeolocationPositionError.PERMISSION_DENIED) ? getI18nString('sgn_geolocation_error_permission_denied', message) :
		            (code === GeolocationPositionError.POSITION_UNAVAILABLE) ? getI18nString('sgn_geolocation_error_position_unavailable', message) :
		            (code === GeolocationPositionError.TIMEOUT) ? getI18nString('sgn_geolocation_error_request_timeout', message, `${timeout} seconds`) : message;

		if($.SGNSnackbar !== undefined) {
			$.SGNSnackbar(msg);
		}
		if(typeof callback === 'function') {
			callback(true, error);
		}
	}, options);

	const setLocation = (coordinates, position, location) => {
		if(element instanceof HTMLElement || element instanceof jQuery) {
			element = (element instanceof jQuery) ? $(element)[0] : element;
			const $element = $(element);

			if(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
				if(element instanceof HTMLTextAreaElement)
					$element.text(location).data('sgn-user-location', coordinates).trigger('change');
				else {
					const type = ($element.attr('type') || 'text').toLowerCase();

					if(type !== 'checkbox' && type !== 'radio' && type !== 'toggle' && type !== 'switch')
						$element.val(location).data('sgn-user-location', coordinates).trigger('change');
				}
			}
		}

		if(typeof callback === 'function') {
			callback(false, coordinates, position);
		} else {
			$elem.hideLoader();
		}
	}
}

$(document).ready(function() {
	$.extend({
		NMAjax: function(options) {
			if(options.url === undefined)
				Console.error("NMAjax: Value for parameter 'url' is not specified!");
			if(options.data === undefined)
				Console.error("NMAjax: Value for parameter 'data' is not specified!");
			if(options.success === undefined)
				Console.error("NMAjax: Callback function for parameter 'success' is not specified!");
			$.ajax({
				url: options.url,
				type: "POST",
				data: options.data,
				success: function(d) {
					d = is_json(d) ? $.parseJSON(d) : d;
					if(typeof options.success == "function")
						options.success(d);
				},
				error: function(xhr) {
					if(typeof options.error == "function")
						options.error(xhr);
				},
			});
		},
	});
	$.fn.extend({
		showButtonSpinner: function(keepText = false, style) {
			style = (style) ? " style=\"" + style + "\"" : "";
			return this.each(function() {
				$(this).data("sgn-spinner-text", $(this).html());
				$(this).attr("disabled", true).addClass("disabled loading");
				const width  = $(this).width(),
				      height = $(this).height();

				if(keepText)
					$(this).html("<i class=\"fas fa-spinner fa-spin\"" + style + "></i> " + $(this).text());
				else
					$(this).html("<i class=\"fas fa-spinner fa-spin\"" + style + "></i>");


				$(this).width(width).height(height);
			});
		},
		hideButtonSpinner: function() {
			return this.each(function() {
				$(this).children("fa-spin").remove();
				$(this).html($(this).data("sgn-spinner-text"));
				$(this).removeAttr("disabled").removeClass("disabled loading");
			});
		},
		showButtonDone: function(keepText = false, style) {
			style = (style) ? " style=\"" + style + "\"" : "";
			return this.each(function() {
				$(this).hideButtonSpinner();
				$(this).data("sghcl-cms-spinner-text", $(this).html());
				$(this).attr("disabled", true).addClass("disabled");
				if(keepText)
					$(this).html("<i class=\"fas fa-check\"" + style + "></i> " + $(this).text());
				else
					$(this).html("<i class=\"fas fa-check\"" + style + "></i>");
			});
		},
		hideButtonDone: function() {
			return this.each(function() {
				$(this).children("fa-check").remove();
				$(this).html($(this).data("sghcl-cms-spinner-text"));
				$(this).removeAttr("disabled").removeClass("disabled");
			});
		},
		showButtonFailed: function(keepText = false) {
			return this.each(function() {
				$(this).data("nm-failed-text", $(this).text());
				$(this).attr("disabled", true).addClass("disabled");
				if(keepText)
					$(this).html("<i class=\"fas fa-times\"></i> " + $(this).text());
				else
					$(this).html("<i class=\"fas fa-times\"></i>");
			});
		},
		hideButtonFailed: function() {
			return this.each(function() {
				$(this).children("fa-times").remove();
				$(this).html($(this).data("nm-failed-text"));
				$(this).removeAttr("disabled").removeClass("disabled");
			});
		},
		showInputSpinner: function(keepText = false, style) {
			style = (style) ? " style=\"" + style + "\"" : "";
			return this.each(function() {
				const $this = $(this);
				if($this.parents(".md-form").length > 0) {
					$this.data("ctpl-spinner-text", $this.html());
					$this.attr("disabled", true);
					const $container   = $this.parents(".md-form").find(".sgngf-input-container"),
					      $iccontainer = $this.parents(".md-form").find(".sgngf-input-addon");
					if(!$iccontainer.find(".fa-spin").length) {
						if(keepText)
							$container.before("<div class=\"sgngf-input-addon ctpl-loader\"><i class=\"fas fa-spinner fa-spin\"" + style + "></i> " + $(this).text() + "</div>");
						else
							$container.before("<div class=\"sgngf-input-addon ctpl-loader\"><i class=\"fas fa-spinner fa-spin\"" + style + "></i></div>");
					}
				} else {
					$(this).data("nm-spinner-text", $this.html());
					$(this).attr("disabled", true);
					if(!$(this).parent().find(".fa-spin").length) {
						if(keepText)
							$(this).after("<i class=\"fas fa-spinner fa-spin ctpl-loader\"" + style + "></i> " + $(this).text());
						else
							$(this).after("<i class=\"fas fa-spinner fa-spin ctpl-loader\"" + style + "></i>");
					}
				}
			});
		},
		hideInputSpinner: function() {
			return this.each(function() {
				const $this = $(this).parent();
				$this.find(".fa-spin").remove();
				//$(this).html($(this).data('nm-spinner-text'));
				$(this).removeAttr("disabled");
			});
		},
		/*showLoader: function(alignWithFlex = true, classes) {
		 classes = (classes) ? "nm-loader-align-flex " + classes : "nm-loader-align-flex";
		 if(classes === undefined) {
		 this.addClass("nm-loader");
		 this.html("<div class='nm-spinner'><div class='nm-icon'><img src='" + QTConfig.urls.root.global + "icons/medium.png' alt=''/></div><div class='spinner'></div></div>");
		 } else {
		 this.data("nm-loader-classes", classes);
		 this.addClass("nm-loader " + classes);
		 this.html("<div class='nm-spinner " + classes + "'><div class='nm-icon'><img src='" + QTConfig.urls.root.global + "icons/medium.png' alt=''/></div><div class='spinner'></div></div>");
		 }
		 },
		 hideLoader: function() {
		 const classes = this.data("nm-loader-classes");
		 if(classes !== undefined)
		 this.removeClass("nm-loader " + classes);
		 this.removeClass("nm-loader");
		 this.find(".nm-spinner").remove();
		 },*/
		showLoader: function() {
			const $this = $(this);
			const $sgnInput = ($this.hasClass('sgn-input-wrapper')) ? $this : $this.parents('.sgn-input-wrapper');
			if($sgnInput.length > 0) {
				$sgnInput.children('.form-control').SGNInput().showLoader();
			} else
				$this.SGNSpinner().showLoader();
		},
		hideLoader: function() {
			const $this = $(this);
			const $sgnInput = ($this.hasClass('sgn-input-wrapper')) ? $this : $this.parents('.sgn-input-wrapper');
			if($sgnInput.length > 0) {
				$sgnInput.children('.form-control').SGNInput().hideLoader();
			} else
				$this.SGNSpinner().hideLoader();
		},
		showBackdropLoader: function(options) {
			let $this = this;
			let append  = (typeof options.append !== "boolean") ? true : options.append,
			    classes = (options.classes !== undefined) ? options.classes : undefined,
			    padding = (typeof options.padding !== "string") ? undefined : options.padding,
			    //margin  = (typeof options.margin !== 'string') ? undefined : options.margin,
			    styles  = (typeof options.styles !== "object") ? "" : options.styles;

			this.addClass("sghcl-backdrop-loader-container");
			let html;
			let width  = this.width(),
			    height = this.height(),
			    left   = 0,
			    top    = 0;

			if(padding !== undefined) {
				width = "calc(100% - (" + padding + " * 2))";
				height = "calc(100% - (" + padding + " * 2))";
				left = padding;
				top = padding;

				styles += "width: " + width + "; height: " + height + "; left: " + left + "; top: " + top + ";";
			}

			if(classes === undefined) {
				html = "<div class=\"sghcl-backdrop-loader\" style=\"" + styles + "\"><div class=\"sghcl-backdrop-loader-spinner default\"></div></div>";
			} else {
				this.data("sghclbdl-loader-classes", classes);
				html = "<div class=\"sghcl-backdrop-loader\" style=\"" + styles + "\"><div class=\"sghcl-backdrop-loader-spinner " + classes + "\"></div></div>";
			}

			console.log(this);
			if(append)
				this.append(html);
			else
				this.html(html);

			setTimeout(function() {
				$this.find(".sghcl-backdrop-loader").addClass("fadein");
			}, 1000);
		},
		hideBackdropLoader: function() {
			const $this = $(this);
			//const classes = this.data('sghclbdl-loader-classes');
			this.removeClass("sghcl-backdrop-loader-container");
			this.find(".sghcl-backdrop-loader").addClass("fadeout");
			setTimeout(function() {
				$this.find(".sghcl-backdrop-loader").remove();
			}, 1100);
		},
		disable: function() {
			return this.each(function() {
				$(this).attr("disabled", true).addClass("disabled");
				$(this).parents(".sgn-form").addClass("disabled");
			});
		},
		enable: function() {
			return this.each(function() {
				if($(this).prop("nodeName") === "SELECT" && $(this).hasClass("sgn-select")) {
					if($(this).is(":disabled")) {
						$(this).removeAttr("disabled").removeClass("disabled");
					}
				} else
					$(this).removeAttr("disabled").removeClass("disabled");
				$(this).parents(".sgn-form").removeClass("disabled");
			});
		},
		postLoad: function(url, callback) {
			this.each(function() {
				const $this = $(this);
				$.ajax({
					type: "POST",
					url: url,
					data: getUrlVars(url),
					success: function(d) {
						$this.html(d);
						if(typeof callback == "function")
							callback(d);
					},
				});
			});
		},
		SGNLoad: function(url, callback) {
			return this.each(function() {
				const $this = $(this);
				$this.load(url, function(d) {
					if(typeof callback == "function")
						callback(d);
				});
			});
		},
	});
});
$.extend({
	/**
	 * @return {string|null}
	 */
	GET: function(name, url) {
		if(!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex   = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		      results = regex.exec(url);
		if(!results)
			return null;
		if(!results[2])
			return "";
		return (name === undefined) ? results[2] : decodeURIComponent(results[2].replace(/\+/g, " "));
	},
	deepValueSearch: function(obj, val) {
		let check = false;
		$.each(obj, function() {
			const testObject = this;
			$.each(testObject, function(k, v) {
				if(val === v) {
					check = true;
				}
			});
		});
		return check;
	},
	retrieveUriParam: function(ret) {
		const parsed = {
			host: $(location).attr("host"),			//www.test.com:8082
			domain: $(location).attr("hostname"),	//www.test.com
			port: $(location).attr("port"),			//8082
			protocol: $(location).attr("protocol"),	//http
			path: $(location).attr("pathname"),		//index.php
			section: $(location).attr("href"),		//http://www.test.com:8082/index.php#tab2
			hash: $(location).attr("hash"),			//#tab2
			args: $(location).attr("search"),		//?foo=123
		};
		return parsed[ret];
	},
	isURL: function(url) {
		const regex = /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/;
		return regex.test(url);
	},
	isJSON: function(item) {
		item = typeof item !== "string" ? JSON.stringify(item) : item;
		try {
			item = JSON.parse(item);
		} catch(e) {
			return false;
		}
		return typeof item === "object" && item !== null;
	},
	createUrlParam: function(data) {
		let string = data;
		if(data !== null || data !== "") {
			string = JSON.stringify(data);
			string = string.replace(/[-}{[\]()"'=]/g, "");
		}
		return string;
	},
	getAsUriParameters: function(data) {
		let url = "";
		for(const prop in data) {
			if(data.hasOwnProperty(prop))
				url += prop + "=" + data[prop] + "&";
		}
		return url.substring(0, url.length - 1);
	},
	readFile: function($el, callback, data) {
		const reader = new FileReader();
		const file = $el[0].files[0];

		let fdata = {};
		fdata = $.extend(fdata, data);

		if(file === undefined) {
			if(typeof callback === "function")
				callback(false, fdata);
		} else {
			fdata.file = {
				"name": file.name,
				"lastModified": file.lastModified,
				"webkitRelativePath": file.webkitRelativePath,
				"size": file.size,
				"type": file.type,
				"data": "",
			};
			reader.addEventListener("loadend", function() {
				fdata.file.data = reader.result.split(",", 2)[1];
				fdata.file = JSON.stringify(fdata.file);
				if(typeof callback === "function")
					callback(true, fdata);
			}, false);

			reader.readAsDataURL(file);
		}
	},
	SGNAjax: function(options, callback) {
		let noJsonCheck = (options.noJsonCheck !== undefined);
		delete options.noJsonCheck;

		let settings = {
			headers: {
				Accept: "application/json",
			},
			type: "POST",
		};
		//const xhrFields = {};
		if(options.url === undefined)
			Console.error("SGNAjax: Value for parameter 'url' is not specified!");
		if(options.data === undefined)
			Console.error("SGNAjax: Value for parameter 'data' is not specified!");
		if(options.success === undefined && typeof callback != "function")
			Console.error("SGNAjax: Callback function for parameter 'success' is not specified!");

		$.extend(settings, options);

		settings.success = function(d) {
			d = is_json(d) ? $.parseJSON(d) : d;
			let error;

			if(!noJsonCheck) {
				error = (typeof d !== "object");
				d = (error) ? {} : d;
				let r = d.response;
				if(r === undefined) {
					r = {
						"code": 500,
						"msg": "Something went wrong while processing your request!",
					};
					d.response = r;
				} else {
					r.code = (r.code === undefined) ? 500 : r.code;
					r.msg = (r.msg === undefined) ? "Something went wrong while processing your request!" : r.msg;
				}
			} else {
				error = false;
			}

			if(typeof options.success == "function")
				options.success(d);
			else if(typeof callback == "function")
				callback(error, d);
		};
		settings.error = function(xhr) {
			const rtxt = is_json(xhr.responseText) ? $.parseJSON(xhr.responseText) : xhr.responseText;
			const rjson = (xhr.hasOwnProperty("responseJSON")) ? xhr.responseJSON : rtxt;
			let d = is_json(rjson) ? $.parseJSON(rjson) : rjson;
			let error;

			if(!noJsonCheck) {
				error = (typeof d !== "object");
				d = (error) ? {} : d;
				let r = d.response;
				if(r === undefined) {
					r = {
						"code": 500,
						"msg": "Something went wrong while processing your request!",
					};
					d.response = r;
				} else {
					r.code = (r.code === undefined) ? 500 : r.code;
					r.msg = (r.msg === undefined) ? "Something went wrong while processing your request!" : r.msg;
				}
			} else {
				error = false;
			}

			if(typeof options.error == "function")
				options.error(xhr);
			else if(typeof callback == "function")
				callback(error, d, xhr);
		};

		settings.async = (options.async === undefined) ? true : options.async;

		if(options.onprogress !== undefined && typeof options.onprogress === "function") {
			/*const onprogress = function(e) {
			 let progressResponse,
			 response = e.currentTarget.response;

			 if(lastResponseLength === false) {
			 progressResponse = response;
			 lastResponseLength = response.length;
			 } else {
			 progressResponse = response.substring(lastResponseLength);
			 lastResponseLength = response.length;
			 }

			 let parsedResponse = JSON.parse(progressResponse),
			 msg            = parsedResponse.msg,
			 progress       = parsedResponse.progress + '%';
			 }*/
		}
		$.ajax(settings);
	},
	xAjax: function(url, type, data, options) {
		// local var
		let response     = null,
		    responseType = "error";
		let async, dataType, encType, pdata, ctype, cache;
		if(options === undefined) {
			async = false;
			dataType = "HTML";
			encType = "";
			pdata = true;
			ctype = true;
			cache = false;
		} else {
			async = (options.async == null) ? false : options.async;
			dataType = (options.dataType == null) ? "HTML" : options.dataType;
			encType = (options.encType == null) ? "" : options.encType;
			pdata = (options.processData == null) ? true : options.processData;
			ctype = (options.contentType == null) ? "application/x-www-form-urlencoded; charset=utf-8" : options.contentType;
			cache = (options.cache == null) ? false : options.cache;
		}
		const request = $.ajax({
			url: url,
			type: type,
			data: data,
			async: async,
			dataType: dataType,
			enctype: encType,
			processData: pdata,
			contentType: ctype,
			cache: cache,
		});
		request.done(function(d) {
			responseType = "success";
			if(typeof options.success == "function")
				options.success(d);
			else
				response = d;
		});
		request.fail(function(xhr) {
			responseType = "error";
			response = xhr.statusText + "\nURL: " + url;
			if(typeof options.error == "function")
				options.error(xhr, xhr.statusText + "\nURL: " + url);
			else
				response = xhr.statusText + "\nURL: " + url;
		});
		// Return the response text
		if(responseType === "success")
			if(typeof options.success != "function")
				return response;
			else if(typeof options.error != "function")
				return response;
	},
	select: function(...obj) {
		let r;
		if(!empty(obj)) {
			for(const k in obj) {
				const o = obj[k];
				if(!empty(o, true)) {
					if(r === undefined)
						r = $(o);
					else
						r = $.merge(r, $(o));
				}
			}
			return r;
		}
	},
});

