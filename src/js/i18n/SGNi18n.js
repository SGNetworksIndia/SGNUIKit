/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/**
 * Create an instance of <b>SGNi18n</b> with the supplied SGNi18n language object and DOM Element.
 *
 * @param {JSON}[language] The SGNi18n language JSON object.
 * @param {HTMLElement|HTMLDocument|jQuery}[$element] The element to process.
 *
 * @return {SGNi18n} An instance of <b>SGNi18n</b>.
 */
class SGNi18n {
	/**
	 * Create an instance of <b>SGNi18n</b> with the supplied SGNi18n language object and DOM Element.
	 *
	 * @param {{}|string} [language] The SGNi18n language JSON object or ISO-639 language code suffixed with ISO-3166-1 (alpha2) country code (i.e., for English (US), en-US).
	 * @param {jQuery | HTMLElement} [$element] The element to use as context of <b>SGNi18n</b>. All the children elements including itself will be able to use <b>SGNi18n</b>.
	 * <br> Specify the whole DOM (HTML element) to make the DOM use the benefits of <b>SGNi18n</b>.
	 *
	 * @return {SGNi18n}
	 */
	constructor(language, $element) {
		const _this                   = this,
		      regex                   = /{{(\w+)(\((((\w+),? ?)*('.*?')*)\))?(\|([^\n\r]+))?}}/gi, // {{txt_copyright('2023')|Copyright Not Found}} or {{txt_copyright|Copyright Not Found}}
		      iso639Regex             = /^[a-z]{2}-[A-Z]{2}$/,
		      languageNameRegex       = /^([A-Z][a-z]{4,}) \(([A-Z]{2}|[A-Z]{1,}[a-z]{1,}[A-Za-z ]{1,})\)$/,
		      languageNativeNameRegex = /^([A-Z][a-z]{4,})$/,
		      versionRegex            = /^\d{10}$/,
		      timestampRegex          = /^\d{10}$/,
		      htmlRegex               = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/gi;
		let observer, usingMutationObserver = false;
		/**
		 * @type {string}
		 */
		_this.dataDir = undefined;
		/**
		 * @type {boolean}
		 */
		_this.isUsingDataDir = false;
		/**
		 * @type {string}
		 */
		_this.language = (iso639Regex.test(language)) ? language : "en-US";
		/**
		 * @type {{}}
		 */
		_this.i18n = (typeof language === "object") ? language : {};
		/**
		 * @type {jQuery|HTMLElement}
		 */
		_this.context = $element;

		if(typeof window.forEach !== "function") {
			/**
			 * Performs the specified action for each element in an object.
			 *
			 * @param {Object} obj
			 * @param {(value:any, key:string)=>void} callback A function that accepts up to three arguments. forEach calls the <b><i>callback</i></b> function one time for each element in the object.
			 */
			const forEach = (obj, callback) => {
				let value;

				for(const key in obj) {
					if(key !== "length" && obj.hasOwnProperty(key)) {  //to rule out inherited properties
						value = obj[key];
						if(typeof callback === "function") callback(value, key);
					}
				}
			};
		}

		if(typeof window.push !== "function") {
			/**
			 * Appends new elements to the end of an object, and returns the new length of the object.
			 * @param {Object} obj
			 * @param {...any} items New elements to add to the object.
			 */
			const push = (obj, ...items) => {
				let k = obj.length || 0;

				items.forEach((value) => {
					obj[k] = value;
					k++;
					obj.length = k;
				});
			};
		}

		const SGNi18nObject = {
			i18nObj: {},
			onChangeListener: {},
			/**
			 * Set i18n JSON object to use for i18n queries. All the queries to <b>SGNi18n.getString()</b> will resolve to it.
			 *
			 * @param {{}} i18n The i18n JSON object to use for i18n queries. All the queries to <b>SGNi18n.getString()</b> will resolve to it.
			 */
			set i18n(i18n) {
				if(typeof i18n === "object") {
					const prev = this.i18nObj;
					this.i18nObj = _this.i18n = i18n;
					forEach(this.onChangeListener, (listener) => listener(this.i18nObj, prev));
				}
			},

			/**
			 * Set the handler for <b>SGNUIKit</b> <b><i>OnChange</i></b> event, which will be triggered when a component is loaded/removed or the status of readiness is changed.
			 *
			 * @param {SGNUIKitChangeCallback}listener
			 * @param {string|number}[id=undefined]
			 */
			setOnChangeListener: function(listener, id) {
				if(typeof id === "string" || typeof id === "number") {
					this.onChangeListener[id] = listener;
				} else {
					push(this.onChangeListener, listener);
				}
			}
		};

		if(window.SGNUIKit) {
			SGNUIKit.holdReady = true;
		}

		/**
		 * Refresh the whole <i>context</i>.
		 */
		_this.refresh = () => {
			let ctx;

			const start = () => {
				if(ctx.nodeName !== "HTML") {
					walkText(document.getElementsByTagName("title")[0]);
				}
				if(!usingMutationObserver)
					walkText(ctx);
				if(window.SGNUIKit) {
					SGNUIKit.holdReady = false;
				}
			};

			if(_this.context !== undefined) {
				if(_this.context instanceof jQuery && _this.context.length > 0) {
					ctx = _this.context[0];
				} else {
					ctx = _this.context;
				}
				if(_this.isUsingDataDir) {
					SGNi18nObject.setOnChangeListener(() => start());
				} else {
					start();
				}
			}
		};

		/**
		 *
		 * @param {jQuery | HTMLElement} $element The element to use as context of <b>SGNi18n</b>. All the children elements including itself will be able to use <b>SGNi18n</b>.
		 *
		 * @return {SGNi18n} The current instance of <b>SGNi18n</b> for method chaining.
		 */
		_this.setContext = ($element) => {
			_this.context = (_this.context instanceof jQuery && _this.context.length > 0) ? $element[0] : $element;
			if(observer !== undefined) {
				observer.disconnect();
			}

			return _this;
		};

		/**
		 * Set or change the directory of i18n language data.
		 *
		 * @param {string} dir The publicly accessible directory where the i18n language data are located. The directory can be protected from direct user access.
		 *
		 * @return {SGNi18n} The current instance of <b>SGNi18n</b> for method chaining.
		 */
		_this.setLanguageDataDirectory = (dir) => {
			_this.dataDir = dir;
			_this.isUsingDataDir = (_this.dataDir !== undefined);

			return _this;
		};

		/**
		 * Set or change the i18n JSON object to use for i18n queries.
		 *
		 * @param {{}|string} language The SGNi18n language JSON object or ISO-639 language code suffixed with ISO-3166-1 (alpha2) country code (i.e., for English (US), en-US).
		 *
		 * @return {SGNi18n} The current instance of <b>SGNi18n</b> for method chaining.
		 */
		_this.setLanguage = (language) => {
			const testLanguage = (language, checkCode = true) => {
				if(!language.hasOwnProperty("name")) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language object does not have the requred property 'name'.`);
				}
				if(!language.hasOwnProperty("native_name")) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language object does not have the requred property 'native_name'.`);
				}
				if(checkCode && !language.hasOwnProperty("code")) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language object does not have the requred property 'code'.`);
				}
				if(!language.hasOwnProperty("version")) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language object does not have the requred property 'version'.`);
				}
				if(!language.hasOwnProperty("timestamp")) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language object does not have the requred property 'timestamp'.`);
				}
				if(checkCode && !iso639Regex.test(language.code)) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language code '${language.code}' is not supported. The language code should be like, 'en-US', 'hi-IN', etc.`);
				}
				if(!languageNameRegex.test(language.name)) {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: Invalid language name '${language.name}'. The language name should be like, 'English (US)', 'English (United States)', etc.`);
				}
				if(checkCode && !languageNativeNameRegex.test(language.native_name)) {
					throw new Warning(`[SGNi18n::setLanguage] Failed to set language: Invalid language native name '${language.native_name}'. The language native name should be like, 'English', 'Hindi', etc.`);
				}
				if(!timestampRegex.test(language.timestamp)) {
					throw new Warning(`[SGNi18n::setLanguage] Failed to set language: Invalid value for property 'timestamp': '${language.timestamp}'. The language timestamp should be unix compatible, like, '1660727259'.`);
				}
			};

			if(_this.isUsingDataDir && typeof language === "string") {
				if(iso639Regex.test(language)) {
					const url = `${_this.dataDir}${language}.json`;
					fetch(url)
						.then(res => res.json())
						.then(out => {
							testLanguage(out, false);
							_this.language = (out.hasOwnProperty("code")) ? out.code : language;
							SGNi18nObject.i18n = out;
						})
						.catch(err => { throw err; });
				} else {
					throw new Error(`[SGNi18n::setLanguage] Failed to set language: The language code '${language}' is not supported.`);
				}
			} else {
				testLanguage(language);
				_this.i18n = language;
				_this.language = (language.hasOwnProperty("code")) ? language.code : "en-US";
			}

			return _this;
		};

		/**
		 * Query the i18n JSON object and fetch an i18n string identified by the specified i18n JSON object key.
		 *
		 * @param {string} key The key of i18n string defined in currently loaded i18n language object.
		 * @param {string|number} [fallback=null] The fallback string to use if the <b><i>key</i></b> is not found in the currently loaded i18n language object.
		 * @param {string|number|boolean} [args] Any other additional values to pass to the i18n object identified by <b><i>key</i></b> (applicable only, if the string is found).
		 *
		 * @return {string|number} The i18n string if found. If <b><i>fallback</i></b> is specified then the content specified in <b><i>fallback</i></b> parameter.
		 * <br/>
		 * Otherwise if the key "SGN_I18N_KEY_UNDEFINED" defined in the i18n language object then, the value of the
		 * "SGN_I18N_KEY_UNDEFINED" in current i18n language, otherwise, "{{key}}_undefined" as string.
		 */
		_this.getString = (key, fallback, ...args) => {
			if(typeof _this.i18n === "object" && _this.i18n.hasOwnProperty(key)) {
				let value = (args !== undefined && args !== null) ? _this.i18n[key].format(...args) : _this.i18n[key];
				if(regex.test(value)) {
					const matches = getMatches(value, regex);

					if(matches !== null) {
						const match = matches[0][1];

						value = (match !== key) ? process(value) : value;
					}
				}
				return (typeof window.html_entities_decode === "function") ? html_entities_decode(value) : value;
			} else {
				const final = (!empty(fallback)) ? fallback : `${key}_not_defined`;
				return (typeof window.html_entities_decode === "function") ? html_entities_decode(final) : final;
			}
		};

		/**
		 * Translate digits/numbers from a source script to target.
		 * See the link below for **script names**. The script names written as *'U+0660 ٠ ARABIC-INDIC DIGIT ZERO'*,
		 * here **"U+0660"** is the Unicode code, **"٠"** is the arabic-indic digit 'zero (0)' and **"ARABIC-INDIC"** is the name of the **script**,
		 * to use the **"ARABIC-INDIC"** as the ***target*** or ***source*** parameter we have to write it in *camelCase* as **"arabicIndic"**.
		 *
		 * @param {number}input The number or digits to translate.
		 * @param {string}target The name of the script to translate to.
		 * @param {string}[source=arabic] The name of the script to translate from.
		 *
		 * @return {string} The translated number or digits.
		 *
		 * @see https://en.wikipedia.org/wiki/Symbols_for_zero#Zero_symbols_in_Unicode
		 */
		_this.translateNumerals = (input, target, source = "arabic") => {
			const systems = {
				      "digitZero": 0,
				      "arabic": 48,
				      "adlam": 125264, "ahom": 71472, "arabicIndic": 1632, "arabicSmallHighRoundedZero": 1759, "arabicSmallHighUprightRectangularZero": 1760, "balinese": 6992,
				      "bengali": 2534, "bhaiksuki": 72784, "brahmi": 69734,
				      "chakma": 69942, "cham": 43600, "circled": 9450, "circledZeroWithSlash": 127245, "combiningDevanagari": 43232, "combiningGrantha": 70502,
				      "devanagari": 2406, "digitZeroComma": 127233, "digitZeroFullStop": 127232, "dingbatCircledSansSerif": 127243, "dingbatNegativeCircledSansSerif": 127244, "divesAkuru": 72016,
				      "extendedArabicIndic": 1776, "fullwidth": 65296, "greekZeroSign": 65930,
				      "gujarati": 2790, "gunjalaGondi": 73120, "gurmukhi": 2662,
				      "hanifiRohingya": 68912, "ideographicNumberZero": 12295, "ideographicTelegraphSymbolForHourZero": 13144, "javanese": 43472,
				      "kannada": 3302, "kayahLi": 43264, "khmer": 6112, "khudawadi": 70384, "ko": 1984, "lao": 3792,
				      "lepcha": 7232, "limbu": 6470,
				      "malayalam": 3430, "masaramGondi": 73040,
				      "mathematicalBold": 120782, "mathematicalDoubleStruck": 120792, "mathematicalMonospace": 120822, "mathematicalSansSerif": 120802, "mathematicalSansSerifBold": 120812,
				      "mayanNumeralZero": 119520, "medefaidrin": 93824, "meeteiMayek": 44016,
				      "modi": 71248, "mongolian": 6160, "mro": 92768, "myanmar": 4160, "myanmarShan": 4240, "myanmarTaiLaing": 43504,
				      "nagari": 2534, "negativeCircled": 9471, "newTaiLue": 6608, "newa": 70736, "nyiakengPuachueHmong": 123200,
				      "olChiki": 7248, "oriya": 2918, "osmanya": 66720, "pahawhHmong": 93008,
				      "saurashtra": 43216, "segmented": 130032, "sharada": 70096, "sinhalaLith": 3558, "soraSompeng": 69872, "subscriptZero": 8320, "sundanese": 7088, "superscriptZero": 8304,
				      "tag": 917552, "taiThamHora": 6784, "taiThamTham": 6800, "takri": 71360,
				      "tamil": 3046, "telugu": 3174, "teluguFractionForOddPowersOfFour": 3192, "thai": 3664, "tibetan": 3872, "tibetanDigitHalfZero": 3891, "tirhuta": 70864,
				      "vai": 42528, "vulgarFractionZeroThirds": 8585, "wancho": 123632, "warangCiti": 71904
			      },
			      output  = [];
			let offset = 0, zero = 0, nine = 0, char = 0;

			source = source.toLowerCase();
			target = target.toLowerCase();

			if(!(source in systems && target in systems) || input == null || typeof input == "undefined" || typeof input == "object") {
				return input;
			}

			input = input.toString();
			offset = systems[target] - systems[source];
			zero = systems[source];
			nine = systems[source] + 9;

			for(let i = 0, l = input.length; i < l; i++) {
				const char = input.charCodeAt(i);

				if(char >= zero && char <= nine) {
					output.push(String.fromCharCode(char + offset));
				} else {
					output.push(input[i]);
				}
			}
			return output.join("");
		};

		function getMatches(string, regex, index) {
			//index || (index = 1); // default to the first capturing group
			const matches = [];
			let match;
			regex.lastIndex = 0;
			while(match = regex.exec(string)) {
				if(index) {
					matches.push(match[index]);
				} else {
					matches.push(match);
				}
			}
			return matches;
		}

		function process(str) {
			str = str.replace(regex, function(match, var_name, p3, p4, p5, p6, p7, p8, fallback_str) {
				if(var_name !== str) {
					let args = p4, params = p7;
					if(params !== undefined && params !== null) {
						params = params.replaceAll(",", "{%COMMA%}");
						args = args.replaceAll(p7, params);

						args = args.replaceAll(",", "{%SEMICOLON%}");
						args = args.replaceAll(/\s?{%SEMICOLON%}\s?/g, ";");
						args = args.replaceAll(/{%COMMA%}/g, ",");
					}

					let final = str;
					if(args !== undefined && args !== null) {
						args = args.split(";");
						final = _this.getString(var_name, fallback_str, ...args);
						return (typeof window.html_entities_decode === "function") ? html_entities_decode(final) : final;
					}
					final = _this.getString(var_name, fallback_str);
					return (typeof window.html_entities_decode === "function") ? html_entities_decode(final) : final;
				}
			});

			return str;
		}

		function walkText(node, iterate = true) {
			if(node.nodeType === 3) {
				if(regex.test(node.data)) {
					const data = process(node.data);
					if(htmlRegex.test(data)) {
						const html = data.replace(/(>) +| +(<)/g, "$1&nbsp;$2") // Preserve white-spaces
						                 .replace(/(>)\t+|\t+(<)/g, "$1&#9;$2") // Preserve TAB stops
						                 .replace(/(>)\n+|\n+(<)/g, "$1&#10;$2") // Preserve Line Feed(s)
						                 .replace(/(>)\r+|\r+(<)/g, "$1&#13;$2"); // Preserve Carriage Return(s)
						const fragment = document.createRange().createContextualFragment(html);
						node.replaceWith(fragment);
					} else {
						node.data = data;
					}
				}
			}
			if(node.nodeType === 1) {
				const title              = node.attributes["title"],
				      sgnInputGroupLabel = node.attributes["sgn-input-group-label"],
				      sgnInputGroupHelp  = node.attributes["sgn-input-group-help"],
				      sgnInputLabel      = node.attributes["sgn-input-label"],
				      sgnInputHelp       = node.attributes["sgn-input-help"],
				      sgnInputPrefix     = node.attributes["sgn-input-prefix"],
				      sgnInputSuffix     = node.attributes["sgn-input-suffix"],
				      nextBtn            = node.attributes["data-next-button"],
				      prevBtn            = node.attributes["data-prev-button"];

				if(title !== undefined) {
					title.value = process(title.value);
				}
				if(sgnInputGroupLabel !== undefined) {
					sgnInputGroupLabel.value = process(sgnInputGroupLabel.value);
				}
				if(sgnInputGroupHelp !== undefined) {
					sgnInputGroupHelp.value = process(sgnInputGroupHelp.value);
				}
				if(sgnInputLabel !== undefined) {
					sgnInputLabel.value = process(sgnInputLabel.value);
				}
				if(sgnInputHelp !== undefined) {
					sgnInputHelp.value = process(sgnInputHelp.value);
				}
				if(sgnInputPrefix !== undefined) {
					sgnInputPrefix.value = process(sgnInputPrefix.value);
				}
				if(sgnInputSuffix !== undefined) {
					sgnInputSuffix.value = process(sgnInputSuffix.value);
				}
				if(nextBtn !== undefined) {
					nextBtn.value = process(nextBtn.value);
				}
				if(prevBtn !== undefined) {
					prevBtn.value = process(prevBtn.value);
				}
			}
			if(node.nodeType === 1 && (node.nodeName === "INPUT" || node.nodeName === "TEXTAREA")) {
				node.placeholder = process(node.placeholder);
				node.value = process(node.value);
			}
			if(iterate && (node.nodeType === 1 && node.nodeName !== "SCRIPT")) {
				for(let i = 0; i < node.childNodes.length; i++) {
					walkText(node.childNodes[i]);
				}
			}
		}

		const setupMutationObserver = () => {
			usingMutationObserver = true;
			// Select the node that will be observed for mutations
			const targetNode = _this.context;

			// Options for the observer (which mutations to observe)
			const config = {attributes: true, childList: true, subtree: true};

			// Callback function to execute when mutations are observed
			const callback = (mutationList, observer) => {
				for(const mutation of mutationList) {
					const type = mutation.type;
					const $target = $(mutation.target);
					if(type === 'childList' && $target !== $(_this.context)) {
						walkText($target[0], false);
					} else {
						walkText($target[0], false);
					}
				}
			};

			// Create an observer instance linked to the callback function
			observer = new MutationObserver(callback);

			// Start observing the target node for configured mutations
			SUKR(() => observer.observe(targetNode, config));

			// Later, you can stop observing
			//observer.disconnect();
		};

		if(_this.isUsingDataDir) {
			_this.setLanguage(_this.language);
		} else if(typeof _this.i18n === "object" && (($element instanceof jQuery && $element.length > 0) || $element instanceof HTMLElement || $element instanceof Node)) {
			_this.refresh();
		}

		return _this;
	}
}

/**
 * Translate digits/numbers from a source script to target.
 * See the link below for **script names**. The script names written as *'U+0660 ٠ ARABIC-INDIC DIGIT ZERO'*,
 * here **"U+0660"** is the Unicode code, **"٠"** is the arabic-indic digit 'zero (0)' and **"ARABIC-INDIC"** is the name of the **script**,
 * to use the **"ARABIC-INDIC"** as the ***target*** or ***source*** parameter we have to write it in *camelCase* as **"arabicIndic"**.
 *
 * @param {number}input The number or digits to translate.
 * @param {string}target The name of the script to translate to.
 * @param {string}[source=arabic] The name of the script to translate from.
 *
 * @return {string} The translated number or digits.
 *
 * @see https://en.wikipedia.org/wiki/Symbols_for_zero#Zero_symbols_in_Unicode
 */
function translateNumerals(input, target, source = "arabic") {
	const systems = {
		      "digitZero": 0,
		      "arabic": 48,
		      "adlam": 125264, "ahom": 71472, "arabicIndic": 1632, "arabicSmallHighRoundedZero": 1759, "arabicSmallHighUprightRectangularZero": 1760, "balinese": 6992,
		      "bengali": 2534, "bhaiksuki": 72784, "brahmi": 69734,
		      "chakma": 69942, "cham": 43600, "circled": 9450, "circledZeroWithSlash": 127245, "combiningDevanagari": 43232, "combiningGrantha": 70502,
		      "devanagari": 2406, "digitZeroComma": 127233, "digitZeroFullStop": 127232, "dingbatCircledSansSerif": 127243, "dingbatNegativeCircledSansSerif": 127244, "divesAkuru": 72016,
		      "extendedArabicIndic": 1776, "fullwidth": 65296, "greekZeroSign": 65930,
		      "gujarati": 2790, "gunjalaGondi": 73120, "gurmukhi": 2662,
		      "hanifiRohingya": 68912, "ideographicNumberZero": 12295, "ideographicTelegraphSymbolForHourZero": 13144, "javanese": 43472,
		      "kannada": 3302, "kayahLi": 43264, "khmer": 6112, "khudawadi": 70384, "ko": 1984, "lao": 3792,
		      "lepcha": 7232, "limbu": 6470,
		      "malayalam": 3430, "masaramGondi": 73040,
		      "mathematicalBold": 120782, "mathematicalDoubleStruck": 120792, "mathematicalMonospace": 120822, "mathematicalSansSerif": 120802, "mathematicalSansSerifBold": 120812,
		      "mayanNumeralZero": 119520, "medefaidrin": 93824, "meeteiMayek": 44016,
		      "modi": 71248, "mongolian": 6160, "mro": 92768, "myanmar": 4160, "myanmarShan": 4240, "myanmarTaiLaing": 43504,
		      "nagari": 2534, "negativeCircled": 9471, "newTaiLue": 6608, "newa": 70736, "nyiakengPuachueHmong": 123200,
		      "olChiki": 7248, "oriya": 2918, "osmanya": 66720, "pahawhHmong": 93008,
		      "saurashtra": 43216, "segmented": 130032, "sharada": 70096, "sinhalaLith": 3558, "soraSompeng": 69872, "subscriptZero": 8320, "sundanese": 7088, "superscriptZero": 8304,
		      "tag": 917552, "taiThamHora": 6784, "taiThamTham": 6800, "takri": 71360,
		      "tamil": 3046, "telugu": 3174, "teluguFractionForOddPowersOfFour": 3192, "thai": 3664, "tibetan": 3872, "tibetanDigitHalfZero": 3891, "tirhuta": 70864,
		      "vai": 42528, "vulgarFractionZeroThirds": 8585, "wancho": 123632, "warangCiti": 71904
	      },
	      output  = [];
	let offset = 0, zero = 0, nine = 0, char = 0;

	source = source.toLowerCase();
	target = target.toLowerCase();

	if(!(source in systems && target in systems) || input == null || typeof input == "undefined" || typeof input == "object") {
		return input;
	}

	input = input.toString();
	offset = systems[target] - systems[source];
	zero = systems[source];
	nine = systems[source] + 9;

	for(let i = 0, l = input.length; i < l; i++) {
		const char = input.charCodeAt(i);

		if(char >= zero && char <= nine) {
			output.push(String.fromCharCode(char + offset));
		} else {
			output.push(input[i]);
		}
	}
	return output.join("");
}

if(typeof root !== "undefined") {
	/**
	 * Create an instance of <b>SGNi18n</b> with the supplied SGNi18n language object and DOM Element.
	 *
	 * @param {JSON}[language] The SGNi18n language JSON object.
	 * @param {HTMLElement|HTMLDocument|jQuery}[$element] The element to process.
	 *
	 * @return {SGNi18n} An instance of <b>SGNi18n</b>.
	 */
	root.SGNi18n = SGNi18n;

	/**
	 * Create an instance of <b>SGNi18n</b> with the supplied SGNi18n language object and DOM Element.
	 *
	 * @param {{}|string} [language] The SGNi18n language JSON object or ISO-639 language code suffixed with ISO-3166-1 (alpha2) country code (i.e., for English (US), en-US).
	 * @param {jQuery | HTMLElement} [$element] The element to use as context of <b>SGNi18n</b>. All the children elements including itself will be able to use <b>SGNi18n</b>.
	 * <br> Specify the whole DOM (HTML element) to make the DOM use the benefits of <b>SGNi18n</b>.
	 *
	 * @return {SGNi18n}
	 */
	root.getSGNi18n = (language, $element) => new SGNi18n(language, $element);

	/**
	 * Get an <b>SGNi18n</b> string identified by <b><i>key</i></b> and also if <b>SGNi18n</b> is used and initialized.
	 *
	 * @param {string} key The <b><i>key</i></b> of i18n string defined in currently loaded <b>SGNi18n</b> language object.
	 * @param {string|number} [fallback=null] The fallback string to use if the <b><i>key</i></b> is not found in the currently loaded i18n language object.
	 * @param {string|number|boolean} [args] Any other additional values to pass to the i18n object identified by <b><i>key</i></b> (applicable only, if the string is found).
	 *
	 * @return {string|number} The i18n string if found. If <b><i>fallback</i></b> is specified then the content specified in <b><i>fallback</i></b> parameter.
	 * <br/>
	 * Otherwise if the key "SGN_I18N_KEY_UNDEFINED" defined in the i18n language object then, the value of the
	 * "SGN_I18N_KEY_UNDEFINED" in current i18n language, otherwise, "{{key}}_undefined" as string.
	 *
	 * @since 1.1.3
	 * @version 1.1.4
	 * @var i18n
	 * @requires SGNi18n
	 */
	root.getI18nString = (key, fallback, ...args) => {
		const i18n = root.i18n || (window.SGNUIKit && window.SGNUIKit.i18n instanceof SGNi18n) ? window.SGNUIKit.i18n : window.i18n;
		return ((typeof i18n !== "undefined" && i18n instanceof SGNi18n) ? i18n.getString(key, fallback, ...args) : fallback);
	};

	if(typeof translateNumerals === "undefined") {
		/**
		 * Translate digits/numbers from a source script to target.
		 * See the link below for **script names**. The script names written as *'U+0660 ٠ ARABIC-INDIC DIGIT ZERO'*,
		 * here **"U+0660"** is the Unicode code, **"٠"** is the arabic-indic digit 'zero (0)' and **"ARABIC-INDIC"** is the name of the **script**,
		 * to use the **"ARABIC-INDIC"** as the ***target*** or ***source*** parameter we have to write it in *camelCase* as **"arabicIndic"**.
		 *
		 * @param {number}input The number or digits to translate.
		 * @param {string}target The name of the script to translate to.
		 * @param {string}[source=arabic] The name of the script to translate from.
		 *
		 * @return {string} The translated number or digits.
		 *
		 * @see https://en.wikipedia.org/wiki/Symbols_for_zero#Zero_symbols_in_Unicode
		 */
		root.translateNumerals = translateNumerals;
	}
}
