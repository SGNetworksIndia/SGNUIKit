/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

Date.prototype.locale = "en-US";
Date.prototype.lang = "en";
Date.prototype.setLocale = (locale = "en-US") => {
	locale = locale || "en-US";
	Date.prototype.locale = (Date.locales.indexOf(locale) !== -1) ? locale : "en-US";

	if(Date.prototype.locale.indexOf("-") !== -1) {
		const locales = Date.prototype.locale.split("-");
		const lang   = locales[0],
		      region = locales[1];
		Date.prototype.lang = (Date.locales.indexOf(lang) !== -1) ? lang : ((Date.locales.indexOf(region) !== -1) ? region : "en");
	} else {
		Date.prototype.lang = (Date.locales.indexOf(locale) !== -1) ? locale : "en";
	}

};

/**
 * Formats:
 * |CHARACTER|DESCRIPTION|RETURNED VALUES|
 * |-------------------------------------|
 * |**d**|Day of the month without leading zeros|1 to 31|
 * |**dd**|Day of the month, 2 digits with leading zeros|01 to 31|
 * |**m**|Numeric representation of a month, without leading zeros|1 through 12|
 * |**mm**|Numeric representation of a month, with leading zeros|01 through 12|
 * |**y**|A two digit representation of a year|Examples: 03 or 23|
 * |**Y**|A full numeric representation of a year, at least 4 digits|Examples: 2003 or 2023|
 * |**M**|A short textual representation of a month, three letters|Jan through Dec|
 * |**F**|A full textual representation of a month, such as January or March|January through December|
 * |**l (lowercase 'L')**|A numerical representation of the day of the week|1 through 7|
 * |**L**|A short textual representation of the day of the week, three letters|Sun through Sat|
 * |**LL**|A full textual representation of the day of the week|Sunday through Saturday|
 * |**o (lowercase 'Oh')**|Lowercase english ordinal suffix for the day of the month, 2 characters|st, nd, rd or th. Works well with j|
 * |**O (uppercase 'Oh')**|Uppercase english ordinal suffix for the day of the month, 2 characters|ST, ND, RD or TH. Works well with j|
 * |-------------------------------------|
 * |**h**|12-hour format of an hour without leading zeros|1 through 12|
 * |**hh**|12-hour format of an hour with leading zeros|01 through 12|
 * |**i**|Minutes without leading zeros|0 through 59|
 * |**ii**|Minutes with leading zeros|00 through 59|
 * |**s**|Seconds without leading zeros|0 through 59|
 * |**ss**|Seconds with leading zeros|00 through 59|
 * |**a**|Lowercase Ante meridiem and Post meridiem|a or p|
 * |**A**|Uppercase Ante meridiem and Post meridiem|A or P|
 * |**aa**|Lowercase Ante meridiem and Post meridiem|am or pm|
 * |**AA**|Uppercase Ante meridiem and Post meridiem|AM or PM|
 * |-------------------------------------|
 *
 * @param {string}format
 */
Date.prototype.format = function(format = "dd F Y hh:ii:ss AA") {
	const regex = /d{1,2}|m{1,2}|M|F|y|Y|o|O|([hisaHISAL])\1?/g;
	const ordinals = this.getOrdinalsMap();
	const locale = this.locale || "en-US";
	const system = Date.locale[this.lang].system;
	const localeIntl    = new Intl.Locale(locale),
	      languageNames = new Intl.DisplayNames(locale, {type: "script"}),
	      plurals       = new Intl.PluralRules(locale, {type: "ordinal"});

	const d       = translateNumerals(this.toLocaleDateString(locale, {day: "numeric"}), system),
	      dd      = translateNumerals(this.toLocaleDateString(locale, {day: "2-digit"}), system),
	      m       = translateNumerals(this.toLocaleDateString(locale, {month: "numeric"}), system),
	      mm      = translateNumerals(this.toLocaleDateString(locale, {month: "2-digit"}), system),
	      M       = this.toLocaleDateString(locale, {month: "short"}),
	      F       = this.toLocaleDateString(locale, {month: "long"}),
	      y       = translateNumerals(this.toLocaleDateString(locale, {year: "2-digit"}), system),
	      Y       = translateNumerals(this.toLocaleDateString(locale, {year: "numeric"}), system),
	      L       = this.toLocaleDateString(locale, {weekday: "short"}),
	      LL      = this.toLocaleDateString(locale, {weekday: "long"}),

	      H       = translateNumerals(this.toLocaleTimeString(locale, {hour: "numeric", hour12: false}).replace(/AM|PM/ig, "").trim().ltrim("0"), system),
	      HH      = translateNumerals(this.toLocaleTimeString(locale, {hour: "2-digit", hour12: false}).replace(/AM|PM/ig, "").trim(), system),
	      h       = translateNumerals(this.toLocaleTimeString(locale, {hour: "numeric", hour12: true}).replace(/AM|PM/ig, "").trim().ltrim("0"), system),
	      hh      = translateNumerals(this.toLocaleTimeString(locale, {hour: "2-digit", hour12: true}).replace(/AM|PM/ig, "").trim(), system),
	      i       = translateNumerals(this.toLocaleTimeString(locale, {minute: "numeric"}), system),
	      ii      = translateNumerals(this.toLocaleTimeString(locale, {minute: "2-digit"}), system),
	      s       = translateNumerals(this.toLocaleTimeString(locale, {second: "numeric"}), system),
	      ss      = translateNumerals(this.toLocaleTimeString(locale, {second: "2-digit"}), system),
	      a       = this.getMeridian("a"),
	      aa      = this.getMeridian("aa"),
	      ordinal = plurals.select(d);
	//ordinal = ordinals[d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10];
	const flags = {
		d: d,
		dd: dd,
		m: m,
		mm: mm,
		M: M,
		F: F,
		y: y,
		Y: Y,
		h: h,
		hh: hh,
		H: H,
		HH: HH,
		i: i,
		ii: ii,
		s: s,
		ss: ss,
		a: a.toLowerCase(),
		aa: aa.toLowerCase(),
		A: a.toUpperCase(),
		AA: aa.toUpperCase(),
		o: ordinal.toLowerCase(),
		O: ordinal.toUpperCase(),
		l: this.getDay() + 1,
		L: L,
		LL: LL
		/* l:    pad(L, 3),
		 L:    pad(L > 99 ? Math.round(L / 10) : L),
		 Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
		 o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4) */
	};
	let r = format.replace(regex, function($0) {
		return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
	});
	return r;
};

Date.prototype.getMonthName = function(lang) {
	lang = lang || this.lang;
	lang = lang && (lang in Date.locale) ? lang : "en";
	return Date.locale[lang].months[this.getMonth()];
};

Date.prototype.getMonthNameShort = function(lang) {
	lang = lang || this.lang;
	lang = lang && (lang in Date.locale) ? lang : "en";
	return Date.locale[lang].months_short[this.getMonth()];
};

/**
 *
 * @param {{'dd', 'd'}}format
 */
Date.prototype.getFormattedDate = function(format = "dd") {
	format = (format === "dd" || format === "d") ? format : "dd";
	const date = this.getDate();

	return (format === "dd" && date < 10) ? "0" + date : date;
};

/**
 *
 * @param {{'m', 'mm', 'f', 'F'}}format
 */
Date.prototype.getFormattedMonth = function(format = "m") {
	format = (format === "m" || format === "mm" || format === "f" || format === "F") ? format : "m";
	const month = (format === "f") ? this.getMonthNameShort() : (format === "F") ? this.getMonthName() : this.getMonth();

	return ((format === "mm") && month < 10) ? "0" + month : month;
};

/**
 *
 * @param {{'yy', 'y', 'Y'}}format
 */
Date.prototype.getFormattedYear = function(format = "Y") {
	format = (format === "yy" || format === "y" || format === "Y") ? format : "Y";
	const year = this.getFullYear();

	return (format === "yy" && year < 10) ? "0" + year : year;
};

/**
 *
 * @param {{'hh','HH', 'h', 'H'}}format
 *
 */
Date.prototype.getFormattedHours = function(format = "hh") {
	format = (format === "hh" || format === "HH" || format === "h" || format === "H") ? format : "hh";
	let hours = this.getHours();
	if(format === "hh" || format === "h") {
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
	}

	return ((format === "hh" || format === "HH") && hours < 10) ? "0" + hours : hours;
};

/**
 *
 * @param {{'ii', 'i'}}format
 */
Date.prototype.getFormattedMinutes = function(format = "ii") {
	format = (format === "ii" || format === "i") ? format : "ii";
	const minutes = this.getMinutes();

	return (format === "ii" && minutes < 10) ? "0" + minutes : minutes;
};

/**
 *
 * @param {{'ss', 's'}}format
 */
Date.prototype.getFormattedSeconds = function(format = "ss") {
	format = (format === "ss" || format === "s") ? format : "ss";
	const seconds = this.getSeconds();

	return (format === "ss" && seconds < 10) ? "0" + seconds : seconds;
};

/**
 *
 * @param {{'a', 'A'}}format
 */
Date.prototype.getMeridian = function(format = "A") {
	format = (format === "a" || format === "aa" || format === "A" || format === "AA") ? format : "AA";

	const lang   = this.lang && (this.lang in Date.locale) ? this.lang : "en",
	      locale = Date.locale[lang],
	      obj    = (format === "a" || format === "A") ? locale.meridian_short : locale.meridian;
	const hours = this.getHours(),
	      ampm  = hours >= 12 ? obj["pm"] : obj["am"];

	return ((format === "a" || format === "A")) ? ampm.toLowerCase() : ampm.toUpperCase();
};

/**
 *
 * @param start
 * @param end
 * @param {'both', 'past', 'future'}dir
 * @param short
 * @returns {unknown[]}
 */
Date.prototype.getYearsMap = function(start = 10, end = null, dir = "both", short = false) {
	const y      = this.getFullYear(),
	      system = Date.locale[this.lang].system;
	end = (typeof end !== "number") ? y : end;
	end = (dir === "both" || dir === "future") ? (y + start) : end;
	start = (dir === "both" || dir === "future") ? (y - start) : start;
	const range = (end - start);
	//console.default.log(start, end, range);
	const years = new Array(range).fill(start).map((value, index) => value + index);
	return years.map(year => (!short && year < 10) ? translateNumerals(`0${year}`, system) : translateNumerals(year, system));
};

Date.prototype.getMonthsMap = function(short = false, lang) {
	lang = lang || this.lang;
	lang = lang && (lang in Date.locale) ? lang : "en";
	return (short) ? Date.locale[lang].months_short : Date.locale[lang].months;
};

Date.prototype.getDatesMap = function(short = false) {
	const system = Date.locale[this.lang].system;
	const dates = new Array(new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate()).fill(1).map((value, index) => value + index);
	return dates.map(date => (!short && date < 10) ? translateNumerals(`0${date}`, system) : translateNumerals(date, system));
};

Date.prototype.getHoursMap = function(use24Hour = false, short = false) {
	const system = Date.locale[this.lang].system;
	const hours = new Array((use24Hour) ? 24 : 12).fill((use24Hour) ? 0 : 1).map((value, index) => value + index);
	return hours.map(hour => (!short && hour < 10) ? translateNumerals(`0${hour}`, system) : translateNumerals(hour, system));
};

Date.prototype.getMinutesMap = function(short = false) {
	const system = Date.locale[this.lang].system;
	const minutes = new Array(60).fill(0).map((value, index) => value + index);
	return minutes.map(minute => (!short && minute < 10) ? translateNumerals(`0${minute}`, system) : translateNumerals(minute, system));
};

Date.prototype.getSecondsMap = function(short = false) {
	const system = Date.locale[this.lang].system;
	const seconds = new Array(60).fill(0).map((value, index) => value + index);
	return seconds.map(second => (!short && second < 10) ? translateNumerals(`0${second}`, system) : translateNumerals(second, system));
};

Date.prototype.getMeridiansMap = function(short = false, lang) {
	lang = lang || this.lang;
	lang = lang && (lang in Date.locale) ? lang : "en";
	return (short) ? Date.locale[lang].meridian_short : Date.locale[lang].meridian;
};

Date.prototype.getOrdinalsMap = function(lang) {
	lang = lang || this.lang;
	lang = lang && (lang in Date.locale) ? lang : "en";
	return Date.locale[lang].ordinals;
};

Date.locale = {
	ar: {
		ordinals: ["th", "st", "nd", "rd"],
		meridian: {"am": "AM", "pm": "PM"},
		meridian_short: {"am": "A", "pm": "P"},
		weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
		weekdays_short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
		weekdays_min: ["ح", "ن", "ث", "ع", "خ", "ج", "س", "ح"],
		months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		months_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		today: "هذا اليوم",
		system: "arabicIndic",
		rtl: true
	},
	bn: {
		ordinals: ["র্থ", "ম", "য়", "য়"],
		//meridian: {"am": "দুপুরের আগে", "pm": "দুপুরের পরে"},
		meridian: {"am": "পূর্বাহ্ণ", "pm": "অপরাহ্ণ"},
		meridian_short: {"am": "পূর্বাহ্ণ", "pm": "অপরাহ্ণ"},
		weekdays: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
		weekdays_short: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
		weekdays_min: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"],
		months: ["জানুয়ারী", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "অগাস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
		months_short: ["জানুয়ারী", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "অগাস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
		today: "আজ",
		system: "nagari",
		rtl: false
	},
	en: {
		ordinals: ["th", "st", "nd", "rd"],
		meridian: {"am": "AM", "pm": "PM"},
		meridian_short: {"am": "A", "pm": "P"},
		weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		weekdays_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		weekdays_min: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		months_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		system: "arabic",
		rtl: false
	},
	hi: {
		numbers: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
		ordinals: ["वां", "ला", "रा", "रा"],
		//meridian: {"am": "दोपहर से पहले", "pm": "दोपहर के बाद"},
		meridian: {"am": "पूर्वाह्न", "pm": "अप्रवाहन"},
		meridian_short: {"am": "पूर्वाह्न", "pm": "अप्रवाहन"},
		weekdays: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
		weekdays_short: ["सूर्य", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
		weekdays_min: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
		months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवंबर", "दिसम्बर"],
		months_short: ["जन", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितं", "अक्टूबर", "नवं", "दिसम्बर"],
		today: "आज",
		system: "devanagari",
		rtl: false
	}
};

Date.locales = [
	"af", "af-NA", "af-ZA", "agq", "agq-CM", "ak", "ak-GH", "am", "am-ET", "ar", "ar-001", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ", "ar-EG", "ar-EH", "ar-ER", "ar-IL", "ar-IQ", "ar-JO", "ar-KM",
	"ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-MR", "ar-OM", "ar-PS", "ar-QA", "ar-SA", "ar-SD", "ar-SO", "ar-SS", "ar-SY", "ar-TD", "ar-TN", "ar-YE", "as", "as-IN", "asa", "asa-TZ", "ast",
	"ast-ES", "az", "az-Cyrl", "az-Cyrl-AZ", "az-Latn", "az-Latn-AZ", "bas", "bas-CM", "be", "be-BY", "bem", "bem-ZM", "bez", "bez-TZ", "bg", "bg-BG", "bm", "bm-ML", "bn", "bn-BD", "bn-IN",
	"bo", "bo-CN", "bo-IN", "br", "br-FR", "brx", "brx-IN", "bs", "bs-Cyrl", "bs-Cyrl-BA", "bs-Latn", "bs-Latn-BA", "ca", "ca-AD", "ca-ES", "ca-FR", "ca-IT", "ccp", "ccp-BD", "ccp-IN", "ce",
	"ce-RU", "cgg", "cgg-UG", "chr", "chr-US", "ckb", "ckb-IQ", "ckb-IR", "cs", "cs-CZ", "cy", "cy-GB", "da", "da-DK", "da-GL", "dav", "dav-KE", "de", "de-AT", "de-BE", "de-CH", "de-DE",
	"de-IT", "de-LI", "de-LU", "dje", "dje-NE", "dsb", "dsb-DE", "dua", "dua-CM", "dyo", "dyo-SN", "dz", "dz-BT", "ebu", "ebu-KE", "ee", "ee-GH", "ee-TG", "el", "el-CY", "el-GR", "en",
	"en-001", "en-150", "en-AG", "en-AI", "en-AS", "en-AT", "en-AU", "en-BB", "en-BE", "en-BI", "en-BM", "en-BS", "en-BW", "en-BZ", "en-CA", "en-CC", "en-CH", "en-CK", "en-CM", "en-CX",
	"en-CY", "en-DE", "en-DG", "en-DK", "en-DM", "en-ER", "en-FI", "en-FJ", "en-FK", "en-FM", "en-GB", "en-GD", "en-GG", "en-GH", "en-GI", "en-GM", "en-GU", "en-GY", "en-HK", "en-IE",
	"en-IL", "en-IM", "en-IN", "en-IO", "en-JE", "en-JM", "en-KE", "en-KI", "en-KN", "en-KY", "en-LC", "en-LR", "en-LS", "en-MG", "en-MH", "en-MO", "en-MP", "en-MS", "en-MT", "en-MU",
	"en-MW", "en-MY", "en-NA", "en-NF", "en-NG", "en-NL", "en-NR", "en-NU", "en-NZ", "en-PG", "en-PH", "en-PK", "en-PN", "en-PR", "en-PW", "en-RW", "en-SB", "en-SC", "en-SD", "en-SE",
	"en-SG", "en-SH", "en-SI", "en-SL", "en-SS", "en-SX", "en-SZ", "en-TC", "en-TK", "en-TO", "en-TT", "en-TV", "en-TZ", "en-UG", "en-UM", "en-US", "en-US-POSIX", "en-VC", "en-VG", "en-VI",
	"en-VU", "en-WS", "en-ZA", "en-ZM", "en-ZW", "eo", "es", "es-419", "es-AR", "es-BO", "es-BR", "es-BZ", "es-CL", "es-CO", "es-CR", "es-CU", "es-DO", "es-EA", "es-EC", "es-ES", "es-GQ",
	"es-GT", "es-HN", "es-IC", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH", "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et", "et-EE", "eu", "eu-ES", "ewo", "ewo-CM", "fa", "fa-AF",
	"fa-IR", "ff", "ff-CM", "ff-GN", "ff-MR", "ff-SN", "fi", "fi-FI", "fil", "fil-PH", "fo", "fo-DK", "fo-FO", "fr", "fr-BE", "fr-BF", "fr-BI", "fr-BJ", "fr-BL", "fr-CA", "fr-CD", "fr-CF",
	"fr-CG", "fr-CH", "fr-CI", "fr-CM", "fr-DJ", "fr-DZ", "fr-FR", "fr-GA", "fr-GF", "fr-GN", "fr-GP", "fr-GQ", "fr-HT", "fr-KM", "fr-LU", "fr-MA", "fr-MC", "fr-MF", "fr-MG", "fr-ML", "fr-MQ",
	"fr-MR", "fr-MU", "fr-NC", "fr-NE", "fr-PF", "fr-PM", "fr-RE", "fr-RW", "fr-SC", "fr-SN", "fr-SY", "fr-TD", "fr-TG", "fr-TN", "fr-VU", "fr-WF", "fr-YT", "fur", "fur-IT", "fy", "fy-NL",
	"ga", "ga-IE", "gd", "gd-GB", "gl", "gl-ES", "gsw", "gsw-CH", "gsw-FR", "gsw-LI", "gu", "gu-IN", "guz", "guz-KE", "gv", "gv-IM", "ha", "ha-GH", "ha-NE", "ha-NG", "haw", "haw-US", "he",
	"he-IL", "hi", "hi-IN", "hr", "hr-BA", "hr-HR", "hsb", "hsb-DE", "hu", "hu-HU", "hy", "hy-AM", "id", "id-ID", "ig", "ig-NG", "ii", "ii-CN", "is", "is-IS", "it", "it-CH", "it-IT", "it-SM",
	"it-VA", "ja", "ja-JP", "jgo", "jgo-CM", "jmc", "jmc-TZ", "ka", "ka-GE", "kab", "kab-DZ", "kam", "kam-KE", "kde", "kde-TZ", "kea", "kea-CV", "khq", "khq-ML", "ki", "ki-KE", "kk", "kk-KZ",
	"kkj", "kkj-CM", "kl", "kl-GL", "kln", "kln-KE", "km", "km-KH", "kn", "kn-IN", "ko", "ko-KP", "ko-KR", "kok", "kok-IN", "ks", "ks-IN", "ksb", "ksb-TZ", "ksf", "ksf-CM", "ksh", "ksh-DE",
	"kw", "kw-GB", "ky", "ky-KG", "lag", "lag-TZ", "lb", "lb-LU", "lg", "lg-UG", "lkt", "lkt-US", "ln", "ln-AO", "ln-CD", "ln-CF", "ln-CG", "lo", "lo-LA", "lrc", "lrc-IQ", "lrc-IR", "lt",
	"lt-LT", "lu", "lu-CD", "luo", "luo-KE", "luy", "luy-KE", "lv", "lv-LV", "mas", "mas-KE", "mas-TZ", "mer", "mer-KE", "mfe", "mfe-MU", "mg", "mg-MG", "mgh", "mgh-MZ", "mgo", "mgo-CM",
	"mk", "mk-MK", "ml", "ml-IN", "mn", "mn-MN", "mr", "mr-IN", "ms", "ms-BN", "ms-MY", "ms-SG", "mt", "mt-MT", "mua", "mua-CM", "my", "my-MM", "mzn", "mzn-IR", "naq", "naq-NA", "nb",
	"nb-NO", "nb-SJ", "nd", "nd-ZW", "nds", "nds-DE", "nds-NL", "ne", "ne-IN", "ne-NP", "nl", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-NL", "nl-SR", "nl-SX", "nmg", "nmg-CM", "nn", "nn-NO",
	"nnh", "nnh-CM", "nus", "nus-SS", "nyn", "nyn-UG", "om", "om-ET", "om-KE", "or", "or-IN", "os", "os-GE", "os-RU", "pa", "pa-Arab", "pa-Arab-PK", "pa-Guru", "pa-Guru-IN", "pl", "pl-PL",
	"ps", "ps-AF", "pt", "pt-AO", "pt-BR", "pt-CH", "pt-CV", "pt-GQ", "pt-GW", "pt-LU", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-TL", "qu", "qu-BO", "qu-EC", "qu-PE", "rm", "rm-CH", "rn",
	"rn-BI", "ro", "ro-MD", "ro-RO", "rof", "rof-TZ", "ru", "ru-BY", "ru-KG", "ru-KZ", "ru-MD", "ru-RU", "ru-UA", "rw", "rw-RW", "rwk", "rwk-TZ", "sah", "sah-RU", "saq", "saq-KE", "sbp",
	"sbp-TZ", "se", "se-FI", "se-NO", "se-SE", "seh", "seh-MZ", "ses", "ses-ML", "sg", "sg-CF", "shi", "shi-Latn", "shi-Latn-MA", "shi-Tfng", "shi-Tfng-MA", "si", "si-LK", "sk", "sk-SK",
	"sl", "sl-SI", "smn", "smn-FI", "sn", "sn-ZW", "so", "so-DJ", "so-ET", "so-KE", "so-SO", "sq", "sq-AL", "sq-MK", "sq-XK", "sr", "sr-Cyrl", "sr-Cyrl-BA", "sr-Cyrl-ME", "sr-Cyrl-RS",
	"sr-Cyrl-XK", "sr-Latn", "sr-Latn-BA", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn-XK", "sv", "sv-AX", "sv-FI", "sv-SE", "sw", "sw-CD", "sw-KE", "sw-TZ", "sw-UG", "ta", "ta-IN", "ta-LK",
	"ta-MY", "ta-SG", "te", "te-IN", "teo", "teo-KE", "teo-UG", "tg", "tg-TJ", "th", "th-TH", "ti", "ti-ER", "ti-ET", "to", "to-TO", "tr", "tr-CY", "tr-TR", "tt", "tt-RU", "twq", "twq-NE",
	"tzm", "tzm-MA", "ug", "ug-CN", "uk", "uk-UA", "ur", "ur-IN", "ur-PK", "uz", "uz-Arab", "uz-Arab-AF", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "vai", "vai-Latn", "vai-Latn-LR",
	"vai-Vaii", "vai-Vaii-LR", "vi", "vi-VN", "vun", "vun-TZ", "wae", "wae-CH", "wo", "wo-SN", "xog", "xog-UG", "yav", "yav-CM", "yi", "yi-001", "yo", "yo-BJ", "yo-NG", "yue", "yue-Hans",
	"yue-Hans-CN", "yue-Hant", "yue-Hant-HK", "zgh", "zgh-MA", "zh", "zh-Hans", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW",
	"zu", "zu-ZA"
];

/**
 * Formats:
 * |CHARACTER|DESCRIPTION|RETURNED VALUES|
 * |-------------------------------------|
 * |**d**|Day of the month without leading zeros|1 to 31|
 * |**dd**|Day of the month, 2 digits with leading zeros|01 to 31|
 * |**m**|Numeric representation of a month, without leading zeros|1 through 12|
 * |**mm**|Numeric representation of a month, with leading zeros|01 through 12|
 * |**y**|A two digit representation of a year|Examples: 03 or 23|
 * |**Y**|A full numeric representation of a year, at least 4 digits|Examples: 2003 or 2023|
 * |**M**|A short textual representation of a month, three letters|Jan through Dec|
 * |**F**|A full textual representation of a month, such as January or March|January through December|
 * |**l (lowercase 'L')**|A full textual representation of the day of the week|Sunday through Saturday|
 * |-------------------------------------|
 * |**h**|12-hour format of an hour without leading zeros|1 through 12|
 * |**hh**|12-hour format of an hour with leading zeros|01 through 12|
 * |**i**|Minutes without leading zeros|0 through 59|
 * |**ii**|Minutes with leading zeros|00 through 59|
 * |**s**|Seconds without leading zeros|0 through 59|
 * |**ss**|Seconds with leading zeros|00 through 59|
 * |**a**|Lowercase Ante meridiem and Post meridiem|am or pm|
 * |**A**|Uppercase Ante meridiem and Post meridiem|AM or PM|
 * |-------------------------------------|
 *
 * @type {string[]}
 */
Date.formats = [
	"d", "m", "y", "Y", "M", "F", "l", "L", "LL",
	"dd", "mm",
	"h", "H", "i", "s", "a", "A",
	"hh", "HH", "ii", "ss", "aa", "AA",
	"s", "S"
];
