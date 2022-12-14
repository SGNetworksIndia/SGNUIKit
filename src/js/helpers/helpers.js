/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

function logStopArt(stopArt) {
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
	Console.log("%c" + stopArt, styles);
}

function is_json(str) {
	try {
		JSON.parse(str);
	} catch(e) {
		return false;
	}
	return true;
}

function parse_url(str, component) {
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
	// For loose we added one optional slash to post-scheme to catch file:/// (should restrict this)
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
	const m = parser[mode].exec(str);
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
}

function getUrlVars(url) {
	let hash,
	    json   = {},
	    hashes = url.slice(url.indexOf("?") + 1).split("&");
	for(let i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		json[hash[0]] = hash[1];
	}
	return json;
}

function getI18nString(key, args) {
	return i18n.getString(key, args);
}

function strpos(haystack, needle, offset) {
	const i = (haystack + "").indexOf(needle, (offset || 0));
	return i !== -1;
}

function numbersOnly(f, e) {
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
}


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
function readFile($el, callback, data, stringify = false) {
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
}

/**
 *
 * @param {JSON} data - The form data to merge.
 * @param {jQuery} $fileInputs - The jQuery reference to HTML file inputs.
 * @param {readFileCallback} callback - The callback that handles the response.
 */
function mergeFormData(data, $fileInputs, callback) {
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
}

/**
 *
 * @param {jQuery} $form - The jQuery reference to HTML form element.
 * @param {readFileCallback} callback - The callback that handles the response.
 */
function getFormData($form, callback) {
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
}


window.logStopArt = (stopArt) => logStopArt(stopArt);
window.is_json = (str) => is_json(str);
window.parse_url = (str, component) => parse_url(str, component);
window.getUrlVars = (url) => getUrlVars(url);
window.getI18nString = (key, args) => getI18nString(key, args);
window.strpos = (haystack, needle, offset) => strpos(haystack, needle, offset);
window.numbersOnly = (f, e) => numbersOnly(f, e);
window.readFile = ($el, callback, data, stringify) => readFile($el, callback, data, stringify);
window.mergeFormData = (data, $fileInputs, callback) => mergeFormData(data, $fileInputs, callback);
window.getFormData = ($form, callback) => getFormData($form, callback);

/**
 *
 * Determine whether a variable is empty
 *
 * @param obj Variable to be checked
 * @returns {boolean} <b>TRUE</b> if the <i>obj</i> does not exist or has a value that is empty but not equal to <i><b>zero</b></i>, <b>FALSE</b> otherwise.
 */
window.empty = (obj) => (obj === undefined || obj === null || obj === "");

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
		            showLoader: function(alignWithFlex = true, classes) {
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
				            $(this).parents(".md-form").addClass("disabled");
			            });
		            },
		            enable: function() {
			            return this.each(function() {
				            if($(this).prop("nodeName") === "SELECT" && $(this).hasClass("mdb-select")) {
					            if($(this).is(":disabled")) {
						            $(this).removeAttr("disabled").removeClass("disabled");
					            }
				            } else
					            $(this).removeAttr("disabled").removeClass("disabled");
				            $(this).parents(".md-form").removeClass("disabled");
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
	            showLoader: function(alignWithFlex = true, classes) {
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
			            $(this).parents(".md-form").addClass("disabled");
		            });
	            },
	            enable: function() {
		            return this.each(function() {
			            if($(this).prop("nodeName") === "SELECT" && $(this).hasClass("mdb-select")) {
				            if($(this).is(":disabled")) {
					            $(this).removeAttr("disabled").removeClass("disabled");
				            }
			            } else
				            $(this).removeAttr("disabled").removeClass("disabled");
			            $(this).parents(".md-form").removeClass("disabled");
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
         });

