/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variables rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "SGNTimePicker",
		defaults   = {
			heading: '',
			hours: true,
			minutes: true,
			seconds: true,
			meridian: true,
			tweleveHours: true,
			infiniteScroll: true,
			group: [
				{
					heading: '',
					hours: true,
					minutes: true,
					seconds: true,
					meridian: true,
					tweleveHours: true,

					hoursID: 'sgn-timepickerHours',
					minutesID: 'sgn-timepickerMinutes',
					secondsID: 'sgn-timepickerSeconds',
					meridianID: 'sgn-timepickerMeridian',

					hoursName: 'sgn-timepickerHours',
					minutesName: 'sgn-timepickerMinutes',
					secondsName: 'sgn-timepickerSeconds',
					meridianName: 'sgn-timepickerMeridian',

					hoursClass: 'sgn-timepicker_hours',
					minutesClass: 'sgn-timepicker_minutes',
					secondsClass: 'sgn-timepicker_seconds',
					meridianClass: 'sgn-timepicker_merdian'
				}
			],

			hoursID: 'sgn-timepickerHours',
			minutesID: 'sgn-timepickerMinutes',
			secondsID: 'sgn-timepickerSeconds',
			meridianID: 'sgn-timepickerMeridian',

			hoursName: 'sgn-timepickerHours',
			minutesName: 'sgn-timepickerMinutes',
			secondsName: 'sgn-timepickerSeconds',
			meridianName: 'sgn-timepickerMeridian',

			hoursClass: 'sgn-timepicker_hours',
			minutesClass: 'sgn-timepicker_minutes',
			secondsClass: 'sgn-timepicker_seconds',
			meridianClass: 'sgn-timepicker_merdian'
		};
	var liveTimeInterval = [];

	var keys = {
		'-1': '00',
		48: '0',
		49: '1',
		50: '2',
		51: '3',
		52: '4',
		53: '5',
		54: '6',
		55: '7',
		56: '8',
		57: '9',
		37: 'AL',
		38: 'AU',
		39: 'AR',
		40: 'AD',
		8: 'clear', //BCKSPC
		67: 'clear', //c
		99: 'clear', // C
	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Number.prototype.pad = function(len) {
		return (new Array(len + 1).join("0") + this).slice(-len);
	}

	function formatAMPM(date) {
		var hours   = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? minutes : minutes;
		var r = {
			"A": ampm,
			"h": hours.pad(2),
			"i": minutes.pad(2),
			"s": seconds.pad(2)
		};
		//var strTime = hours + ':' + minutes + ' ' + ampm;
		return r;
	}

	function convertTimeTo24(timeStr) {
		var time_part_array = timeStr.split(":");

		var hours    = time_part_array[0],
			minutes  = time_part_array[1],
			seconds  = time_part_array[2],
			meridian = seconds.substr(seconds.indexOf(':') + 4, 2).toUpperCase();


		var hoursInt = parseInt(hours, 10),
			offset   = meridian == 'PM' ? 12 : 0;

		if(hoursInt === 12) {
			hoursInt = offset;
		} else {
			hoursInt += offset;
		}
		hoursInt = parseInt(hoursInt);
		minutes = parseInt(minutes);
		return {"h": hoursInt, "i": minutes};
	}

	function convertTimeTo12(timeStr) {
		// Take a time in 24 hour format and format it in 12 hour format
		var time_part_array = timeStr.split(":");
		var ampm = 'AM';

		if(time_part_array[0] >= 12) {
			ampm = 'PM';
		}

		if(time_part_array[0] > 12) {
			time_part_array[0] = time_part_array[0] - 12;
		}

		var formatted_time = time_part_array[0] + ':' + time_part_array[1] + ':' + time_part_array[2] + ' ' + ampm;

		var hours   = parseInt(time_part_array[0]),
			minutes = parseInt(time_part_array[1]),
			seconds = parseInt(time_part_array[2]);

		return {"h": hours, "i": minutes, "s": seconds, "A": ampm};
	}

	function parseUnixTimestamp(timestamp) {
		var highPrecisionTimestamp = performance.timing.navigationStart + performance.now();
		var sysDateObj = new Date(highPrecisionTimestamp);

		var options = {
			'timestamp': timestamp
		}
		//getTimezoneOffset gives minutes
		options.tzOffset = sysDateObj.getTimezoneOffset();
		//divide by 60 to get hours from minutes
		var tzOffset = options.tzOffset / 60;

		var digitCountDiff = (sysDateObj.getTime() + '').length - (options.timestamp + '').length;

		//IF THERE ARE MORE THAN TWO DIGITS DIFFERENCE FROM A JAVASCRIPT TIMESTAMP,
		//THEN IT'S A PHP TIMESTAMP
		if(digitCountDiff > 2) {
			options.timestamp = options.timestamp * 1000;
			options.sysdiff = (options.timestamp - sysDateObj.getTime()) + (options.tzOffset * 60 * 1000);
			//options.timezone has most probably been set in this case
		}
		//OTHERWISE IT'S SIMPLY A CUSTOM JAVASCRIPT TIMESTAMP
		else {
			options.sysdiff = options.timestamp - sysDateObj.getTime();
			/* ARE THE NEXT FEW LINES AT ALL USEFUL??? */
			//options.timezone has most probably not been set, let's do some guesswork
			if(options.timezone == "localsystimezone") {
				options.timezone = 'UTC';
				var rmn = tzOffset % 1;
				tzOffset = tzOffset - rmn;
				var suffix = '';
				if(Math.abs(rmn) !== 0) {
					suffix = '' + Math.abs(rmn).map(0, 1, 0, 60);
				}
				if(tzOffset < 0) { options.timezone += ('+' + Math.abs(tzOffset)) + (suffix !== '' ? ':' + suffix : ''); } else if(tzOffset > 0) { options.timezone += (tzOffset * -1) + (suffix !== '' ? ':' + suffix : ''); }
			}
			/* MIGHT WANT TO DOUBLE CHECK IF THE PRECEDING LOGIC IS AT ALL USEFUL... */
		}
		//since system time and timezones affect the Date object, let's make sure it's not going to affect our clock:
		var currentTzOffset = new Date().getTimezoneOffset();
		var correction = (currentTzOffset === options.tzOffset) ? 0 : (currentTzOffset - options.tzOffset) * 60 * 1000;

		var pfnow = performance.now();
		var mytimestamp = performance.timing.navigationStart + pfnow + options.sysdiff + correction;
		var mytimestamp_sysdiff = new Date(mytimestamp);

		return mytimestamp_sysdiff;
	}

	function setEvents(settings, $hours, $minutes, $seconds, $meridian, i, $element) {
		var $hoursInput    = $hours.find("input.sgn-timepicker-input"),
			$minutesInput  = $minutes.find("input.sgn-timepicker-input"),
			$secondsInput  = $seconds.find("input.sgn-timepicker-input"),
			$meridianInput = $meridian.find("input.sgn-timepicker-input");
		var $hoursNextBtn = $hours.find("div.next"),
			$hoursPrevBtn = $hours.find("div.prev");
		var $minutesNextBtn = $minutes.find("div.next"),
			$minutesPrevBtn = $minutes.find("div.prev");
		var $secondsNextBtn = $seconds.find("div.next"),
			$secondsPrevBtn = $seconds.find("div.prev");
		var $meridianNextBtn = $meridian.find("div.next"),
			$meridianPrevBtn = $meridian.find("div.prev");

		$hoursNextBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".hours").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) + 1);
			$input.val(v.pad(2));

			if(settings.infiniteScroll) {
				if(settings.tweleveHours)
					v = (v > 12) ? 1 : (v < 1) ? 12 : v;
				else
					v = (v > 24) ? 1 : (v < 1) ? 12 : v;
			} else {
				if(settings.tweleveHours)
					v = (v > 12) ? 12 : (v < 1) ? 1 : v;
				else
					v = (v > 24) ? 24 : (v < 1) ? 1 : v;
			}
			$input.val(v.pad(2));
			$input.trigger('change');
		});
		$hoursPrevBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".hours").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) - 1);
			$input.val(v.pad(2));

			if(settings.infiniteScroll) {
				if(settings.tweleveHours)
					v = (v > 12) ? 1 : (v < 1) ? 12 : v;
				else
					v = (v > 24) ? 1 : (v < 1) ? 12 : v;
			} else {
				if(settings.tweleveHours)
					v = (v > 12) ? 12 : (v < 1) ? 1 : v;
				else
					v = (v > 24) ? 24 : (v < 1) ? 1 : v;
			}
			$input.val(v.pad(2));
			$input.trigger('change');
		});

		$minutesNextBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".minutes").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) + 1);

			if(settings.infiniteScroll)
				v = (v > 60) ? 0 : (v < 0) ? 60 : v;
			else
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;

			$input.val(v.pad(2));
			$input.trigger('change');
		});
		$minutesPrevBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".minutes").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) - 1);
			if(settings.infiniteScroll)
				v = (v > 60) ? 0 : (v < 0) ? 60 : v;
			else
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;

			$input.val(v.pad(2));
			$input.trigger('change');
		});

		$secondsNextBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".seconds").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) + 1);

			if(settings.infiniteScroll)
				v = (v > 60) ? 0 : (v < 0) ? 60 : v;
			else
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;

			$input.val(v.pad(2));
			$input.trigger('change');
		});
		$secondsPrevBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".seconds").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = (parseInt($input.val()) - 1);

			if(settings.infiniteScroll)
				v = (v > 60) ? 0 : (v < 0) ? 60 : v;
			else
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;

			$input.val(v.pad(2));
			$input.trigger('change');
		});

		$meridianNextBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".meridian").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = ($input.val() == 'AM') ? 'PM' : ($input.val() == 'PM') ? 'AM' : 'PM';

			$input.val(v);
			$input.trigger('change');
		});
		$meridianPrevBtn.on('click', function(e) {
			clearInterval(liveTimeInterval[i]);
			var $this  = $(this),
				$input = $this.parent(".meridian").children(".ti_tx").children("input.sgn-timepicker-input");
			var v = ($input.val() == 'AM') ? 'PM' : ($input.val() == 'PM') ? 'AM' : 'PM';

			$input.val(v);
			$input.trigger('change');
		});


		$hoursInput.keypress(function(e) {
			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			var unicode = e.which || e.keyCode,
				ascii   = String.fromCharCode(unicode);
			if(!keys.hasOwnProperty(unicode)) {
				e.preventDefault();
			} else if(length < maxlength || !v) {
				clearInterval(liveTimeInterval);
			}
		});
		$minutesInput.keypress(function(e) {
			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			var unicode = e.which || e.keyCode,
				ascii   = String.fromCharCode(unicode);
			if(!keys.hasOwnProperty(unicode)) {
				e.preventDefault();
			} else if(length < maxlength || !v) {
				clearInterval(liveTimeInterval);
			}
		});
		$secondsInput.keypress(function(e) {
			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			var unicode = e.which || e.keyCode,
				ascii   = String.fromCharCode(unicode);
			if(!keys.hasOwnProperty(unicode)) {
				e.preventDefault();
			} else if(length < maxlength || !v) {
				clearInterval(liveTimeInterval);
			}
		});

		$hoursInput.keyup(function(e) {
			var keyCode = e.which || e.keyCode;

			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
				e.preventDefault();
				clearInterval(liveTimeInterval);
				if(length == 0 || !v) {
					if(settings.tweleveHours)
						v = 1;
					else
						v = 0;
					$(this).val(v.pad(2));
				} else {
					if(keyCode == 38) {
						v = (parseInt($(this).val()) + 1);
					} else if(keyCode == 40) {
						v = (parseInt($(this).val()) - 1);
					}

					if(settings.infiniteScroll) {
						if(settings.tweleveHours)
							v = (v > 12) ? 1 : (v < 1) ? 12 : v;
						else
							v = (v > 24) ? 1 : (v < 1) ? 12 : v;
					} else {
						if(settings.tweleveHours)
							v = (v > 12) ? 12 : (v < 1) ? 1 : v;
						else
							v = (v > 24) ? 24 : (v < 0) ? 0 : v;
					}
					$(this).val(v.pad(2));
					$input.trigger('change');
				}
			} else if(keyCode == 8)
				clearInterval(liveTimeInterval);
			else if(keys.hasOwnProperty(keyCode)) {
				if(settings.tweleveHours)
					v = (v > 12) ? 12 : (v < 1) ? 1 : v;
				else
					v = (v > 24) ? 24 : (v < 0) ? 0 : v;
				$(this).val(v);
				$input.trigger('change');
			}
		});
		$minutesInput.keydown(function(e) {
			var keyCode = e.which || e.keyCode;

			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
				e.preventDefault();
				clearInterval(liveTimeInterval);
				if(length == 0 || !v) {
					v = 0;
					$(this).val(v.pad(2));
				} else {
					if(keyCode == 38) {
						v = (parseInt($(this).val()) + 1);
					} else if(keyCode == 40) {
						v = (parseInt($(this).val()) - 1);
					}

					if(settings.infiniteScroll) {
						v = (v > 60) ? 0 : (v < 0) ? 60 : v;
					} else {
						v = (v > 60) ? 60 : (v < 0) ? 0 : v;
					}
					$(this).val(v.pad(2));
					$input.trigger('change');
				}
			} else if(keyCode == 8)
				clearInterval(liveTimeInterval);
			else if(keys.hasOwnProperty(keyCode)) {
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;
				$(this).val(v);
				$input.trigger('change');
			}
		});
		$secondsInput.keydown(function(e) {
			var keyCode = e.which || e.keyCode;

			var v         = parseInt($(this).val()),
				length    = v.length,
				maxlength = $(this).attr("maxlength");
			if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
				e.preventDefault();
				clearInterval(liveTimeInterval);
				if(length == 0 || !v) {
					v = 0;
					$(this).val(v.pad(2));
				} else {
					if(keyCode == 38) {
						v = (parseInt($(this).val()) + 1);
					} else if(keyCode == 40) {
						v = (parseInt($(this).val()) - 1);
					}

					if(settings.infiniteScroll) {
						v = (v > 60) ? 0 : (v < 0) ? 60 : v;
					} else {
						v = (v > 60) ? 60 : (v < 0) ? 0 : v;
					}
					$(this).val(v.pad(2));
					$input.trigger('change');
				}
			} else if(keyCode == 8)
				clearInterval(liveTimeInterval);
			else if(keys.hasOwnProperty(keyCode)) {
				v = (v > 60) ? 60 : (v < 0) ? 0 : v;
				$(this).val(v);
				$input.trigger('change');
			}
		});


		$hoursInput.on('change', function(e) {
			var $this       = $(this),
				$timePicker = $this.parents('.sgn-timepicker'),
				v           = [];

			$('.sgn-timepicker-group > .sgn-timepicker').each(function(i, c) {
				var $this              = $(this),
					$wrapper           = $this.children('.sgn-timepicker_wrap'),
					$hoursContainer    = $wrapper.children('.hours'),
					$minutesContainer  = $wrapper.children('.minutes'),
					$secondsContainer  = $wrapper.children('.seconds'),
					$meridianContainer = $wrapper.children('.meridian'),
					$hours             = $hoursContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$minutes           = $minutesContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$seconds           = $secondsContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$meridian          = $meridianContainer.children('.ti_tx').children('.sgn-timepicker-input');

				var hrs = parseInt($hoursInput.val()),
					i   = parseInt($minutes.val()),
					s   = parseInt($seconds.val()),
					A   = $meridian.val().trim();
				var str = (settings.tweleveHours) ? hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2) + ' ' + A : hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2);
				str = str.trim();
				var H = (settings.tweleveHours) ? convertTimeTo24(str).h : hrs,
					h = (settings.tweleveHours) ? convertTimeTo12(str).h : hrs;
				var date = new Date();
				date.setHours(H);
				date.setMinutes(i);
				date.setSeconds(s);
				var ts = Math.floor(date.getTime() / 1000);
				v.push({
					'date': date,
					'str': str,
					'time': {
						'H': H,
						'h': h,
						'i': i,
						's': s,
						'A': A
					},
					'timestamp': ts
				});
			});
			var val;
			$.each(v, function(i, c) {
				if(val === undefined)
					val = c.str;
				else
					val += ';' + c.str;
			});
			$element.val(val);
			$element.data(pluginName + "-value", v);
			$element.trigger('change', [v]);
			$element.trigger('sgntpcompleted', [v]);
		});
		$minutesInput.on('change', function(e) {
			var $this       = $(this),
				$timePicker = $this.parents('.sgn-timepicker'),
				v           = [];

			$('.sgn-timepicker-group > .sgn-timepicker').each(function(i, c) {
				var $this              = $(this),
					$wrapper           = $this.children('.sgn-timepicker_wrap'),
					$hoursContainer    = $wrapper.children('.hours'),
					$minutesContainer  = $wrapper.children('.minutes'),
					$secondsContainer  = $wrapper.children('.seconds'),
					$meridianContainer = $wrapper.children('.meridian'),
					$hours             = $hoursContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$minutes           = $minutesContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$seconds           = $secondsContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$meridian          = $meridianContainer.children('.ti_tx').children('.sgn-timepicker-input');

				var hrs = parseInt($hoursInput.val()),
					i   = parseInt($minutes.val()),
					s   = parseInt($seconds.val()),
					A   = $meridian.val().trim();
				var str = (settings.tweleveHours) ? hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2) + ' ' + A : hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2);
				str = str.trim();
				var H = (settings.tweleveHours) ? convertTimeTo24(str).h : hrs,
					h = (settings.tweleveHours) ? convertTimeTo12(str).h : hrs;
				var date = new Date();
				date.setHours(H);
				date.setMinutes(i);
				date.setSeconds(s);
				var ts = Math.floor(date.getTime() / 1000);
				v.push({
					'date': date,
					'str': str,
					'time': {
						'H': H,
						'h': h,
						'i': i,
						's': s,
						'A': A
					},
					'timestamp': ts
				});
			});
			var val;
			$.each(v, function(i, c) {
				if(val === undefined)
					val = c.str;
				else
					val += ';' + c.str;
			});
			$element.val(val);
			$element.data(pluginName + "-value", v);
			$element.trigger('change', [v]);
			$element.trigger('sgntpcompleted', [v]);
		});
		$secondsInput.on('change', function(e) {
			var $this       = $(this),
				$timePicker = $this.parents('.sgn-timepicker'),
				v           = [];

			$('.sgn-timepicker-group > .sgn-timepicker').each(function(i, c) {
				var $this              = $(this),
					$wrapper           = $this.children('.sgn-timepicker_wrap'),
					$hoursContainer    = $wrapper.children('.hours'),
					$minutesContainer  = $wrapper.children('.minutes'),
					$secondsContainer  = $wrapper.children('.seconds'),
					$meridianContainer = $wrapper.children('.meridian'),
					$hours             = $hoursContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$minutes           = $minutesContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$seconds           = $secondsContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$meridian          = $meridianContainer.children('.ti_tx').children('.sgn-timepicker-input');

				var hrs = parseInt($hoursInput.val()),
					i   = parseInt($minutes.val()),
					s   = parseInt($seconds.val()),
					A   = $meridian.val().trim();
				var str = (settings.tweleveHours) ? hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2) + ' ' + A : hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2);
				str = str.trim();
				var H = (settings.tweleveHours) ? convertTimeTo24(str).h : hrs,
					h = (settings.tweleveHours) ? convertTimeTo12(str).h : hrs;
				var date = new Date();
				date.setHours(H);
				date.setMinutes(i);
				date.setSeconds(s);
				var ts = Math.floor(date.getTime() / 1000);
				v.push({
					'date': date,
					'str': str,
					'time': {
						'H': H,
						'h': h,
						'i': i,
						's': s,
						'A': A
					},
					'timestamp': ts
				});
			});
			var val;
			$.each(v, function(i, c) {
				if(val === undefined)
					val = c.str;
				else
					val += ';' + c.str;
			});
			$element.val(val);
			$element.data(pluginName + "-value", v);
			$element.trigger('change', [v]);
			$element.trigger('sgntpcompleted', [v]);
		});
		$meridianInput.on('change', function(e) {
			var $this       = $(this),
				$timePicker = $this.parents('.sgn-timepicker'),
				v           = [];

			$('.sgn-timepicker-group > .sgn-timepicker').each(function(i, c) {
				var $this              = $(this),
					$wrapper           = $this.children('.sgn-timepicker_wrap'),
					$hoursContainer    = $wrapper.children('.hours'),
					$minutesContainer  = $wrapper.children('.minutes'),
					$secondsContainer  = $wrapper.children('.seconds'),
					$meridianContainer = $wrapper.children('.meridian'),
					$hours             = $hoursContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$minutes           = $minutesContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$seconds           = $secondsContainer.children('.ti_tx').children('.sgn-timepicker-input'),
					$meridian          = $meridianContainer.children('.ti_tx').children('.sgn-timepicker-input');

				var hrs = parseInt($hoursInput.val()),
					i   = parseInt($minutes.val()),
					s   = parseInt($seconds.val()),
					A   = $meridian.val().trim();
				var str = (settings.tweleveHours) ? hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2) + ' ' + A : hrs.pad(2) + ':' + i.pad(2) + ':' + s.pad(2);
				str = str.trim();
				var H = (settings.tweleveHours) ? convertTimeTo24(str).h : hrs,
					h = (settings.tweleveHours) ? convertTimeTo12(str).h : hrs;
				var date = new Date();
				date.setHours(H);
				date.setMinutes(i);
				date.setSeconds(s);
				var ts = Math.floor(date.getTime() / 1000);
				v.push({
					'date': date,
					'str': str,
					'time': {
						'H': H,
						'h': h,
						'i': i,
						's': s,
						'A': A
					},
					'timestamp': ts
				});
			});
			var val;
			$.each(v, function(i, c) {
				if(val === undefined)
					val = c.str;
				else
					val += ';' + c.str;
			});
			$element.val(val);
			$element.data(pluginName + "-value", v);
			$element.trigger('change', [v]);
			$element.trigger('sgntpcompleted', [v]);
		});
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function() {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like the example below
			var $element = $(this.element);
			var settings = this.settings;

			var hoursID      = (this.settings.hoursID) ? ' id="' + this.settings.hoursID + '"' : ' id="sgn-timepickerHours"',
				minutesID    = (this.settings.minutesID) ? ' id="' + this.settings.minutesID + '"' : ' id="sgn-timepickerMinutes"',
				secondsID    = (this.settings.secondsID) ? ' id="' + this.settings.secondsID + '"' : ' id="sgn-timepickerSeconds"',
				meridianID   = (this.settings.meridianID) ? ' id="' + this.settings.meridianID + '"' : ' id="sgn-timepickerMeridian"',

				hoursName    = (this.settings.hoursName) ? ' name="' + this.settings.hoursName + '"' : ' id="sgn-timepickerHours"',
				minutesName  = (this.settings.minutesName) ? ' name="' + this.settings.minutesName + '"' : ' id="sgn-timepickerMinutes"',
				secondsName  = (this.settings.secondsName) ? ' name="' + this.settings.secondsName + '"' : ' id="sgn-timepickerSeconds"',
				meridianName = (this.settings.meridianName) ? ' name="' + this.settings.meridianName + '"' : ' id="sgn-timepickerMeridian"';

			var hoursClass    = (this.settings.hoursClass) ? this.settings.hoursClass : '',
				minutesClass  = (this.settings.minutesClass) ? this.settings.minutesClass : '',
				secondsClass  = (this.settings.secondsClass) ? this.settings.secondsClass : '',
				meridianClass = (this.settings.meridianClass) ? this.settings.meridianClass : '';

			var headingHTML = (this.settings.heading) ? '<div class="heading">' + this.settings.heading + '</div>' : '';


			if(this.settings.group) {
				var groupHTML = '<div class="sgn-timepicker-group">';
				for(var k in this.settings.group) {
					var group = this.settings.group[k];

					var headingHTML = (group.heading) ? '<div class="heading">' + group.heading + '</div>' : headingHTML;

					var hoursID      = (group.hoursID) ? ' id="' + group.hoursID + '"' : hoursID,
						minutesID    = (group.minutesID) ? ' id="' + group.minutesID + '"' : minutesID,
						secondsID    = (group.secondsID) ? ' id="' + group.secondsID + '"' : secondsID,
						meridianID   = (group.meridianID) ? ' id="' + group.meridianID + '"' : meridianID,

						hoursName    = (group.hoursName) ? ' name="' + group.hoursName + '"' : hoursName,
						minutesName  = (group.minutesName) ? ' name="' + group.minutesName + '"' : minutesName,
						secondsName  = (group.secondsName) ? ' name="' + group.secondsName + '"' : secondsName,
						meridianName = (group.meridianName) ? ' name="' + group.meridianName + '"' : secondsName;

					var hoursClass    = (group.hoursClass) ? group.hoursClass : secondsName,
						minutesClass  = (group.minutesClass) ? group.minutesClass : secondsName,
						secondsClass  = (group.secondsClass) ? group.secondsClass : secondsName,
						meridianClass = (group.meridianClass) ? group.meridianClass : secondsName;


					var hoursHTML = '	<div class="hours">';
					hoursHTML += '	<div class="next"></div>';
					hoursHTML += '	<div class="ti_tx">';
					hoursHTML += '	<input type="text" class="sgn-timepicker-input ' + hoursClass + '"' + hoursID + hoursName + ' minlength="2" maxlength="2">';
					hoursHTML += '	</div>';
					hoursHTML += '	<div class="prev"></div>';
					hoursHTML += '	</div>';
					var minutesHTML = '	<div class="minutes">';
					minutesHTML += '	<div class="next"></div>';
					minutesHTML += '	<div class="ti_tx">';
					minutesHTML += '	<input type="text" class="sgn-timepicker-input ' + minutesClass + '"' + minutesID + minutesName + ' minlength="2" maxlength="2">';
					minutesHTML += '	</div>';
					minutesHTML += '	<div class="prev"></div>';
					minutesHTML += '	</div>';
					var secondsHTML = '	<div class="seconds">';
					secondsHTML += '	<div class="next"></div>';
					secondsHTML += '	<div class="ti_tx">';
					secondsHTML += '	<input type="text" class="sgn-timepicker-input ' + secondsClass + '"' + secondsID + secondsName + ' minlength="2" maxlength="2">';
					secondsHTML += '	</div>';
					secondsHTML += '	<div class="prev"></div>';
					secondsHTML += '	</div>';
					var meridianHTML = '	<div class="meridian">';
					meridianHTML += '	<div class="next"></div>';
					meridianHTML += '	<div class="ti_tx">';
					meridianHTML += '	<input type="text" class="sgn-timepicker-input ' + meridianClass + '"' + meridianID + meridianName + ' minlength="2" maxlength="2" readonly>';
					meridianHTML += '	</div>';
					meridianHTML += '	<div class="prev"></div>';
					meridianHTML += '	</div>';

					var html = '<div class="sgn-timepicker">';
					var wrapHTML = '<div class="sgn-timepicker_wrap">';
					if(group.heading || this.settings.heading)
						html += headingHTML;
					if(group.hours || this.settings.hours)
						wrapHTML += hoursHTML;
					if((group.hours && group.minutes) || (this.settings.hours && this.settings.minutes))
						wrapHTML += '<span></span>';
					if(this.settings.minutes)
						wrapHTML += minutesHTML;
					if(((group.minutes && group.seconds) || (group.hours && group.seconds)) || ((this.settings.minutes && this.settings.seconds) || (this.settings.hours && this.settings.seconds)))
						wrapHTML += '<span></span>';
					if(group.seconds || this.settings.seconds)
						wrapHTML += secondsHTML;
					if(group.seconds || this.settings.meridian)
						wrapHTML += meridianHTML;
					wrapHTML += '</div>';
					html += wrapHTML;
					html += '</div>';
					groupHTML += html;
				}
				groupHTML += '</div>';

				$element.after(groupHTML);

				var $timePicker = $(".sgn-timepicker-group > .sgn-timepicker");
				$timePicker.each(function(i, c) {
					var $this = $(this);
					var $wrapper = $this.children(".sgn-timepicker_wrap");
					var $nextBtn = $wrapper.children("div > div.next"),
						$prevBtn = $wrapper.children("div > div.prev");

					var $hours    = $wrapper.children(".hours"),
						$minutes  = $wrapper.children(".minutes"),
						$seconds  = $wrapper.children(".seconds"),
						$meridian = $wrapper.children(".meridian");
					var $hoursInput    = $hours.find("input.sgn-timepicker-input"),
						$minutesInput  = $minutes.find("input.sgn-timepicker-input"),
						$secondsInput  = $seconds.find("input.sgn-timepicker-input"),
						$meridianInput = $meridian.find("input.sgn-timepicker-input");


					liveTimeInterval[i] = setInterval(function() {
						var date = new Date(),
							h    = formatAMPM(date).h,
							m    = formatAMPM(date).i,
							s    = formatAMPM(date).s,
							A    = formatAMPM(date).A;
						$hoursInput.val(h);
						$minutesInput.val(m);
						$secondsInput.val(s);
						$meridianInput.val(A);
					}, 1000);
					setEvents(settings, $hours, $minutes, $seconds, $meridian, i, $element);
				});
			} else {
				var hoursHTML = '	<div class="hours">';
				hoursHTML += '	<div class="next"></div>';
				hoursHTML += '	<div class="ti_tx">';
				hoursHTML += '	<input type="text" class="sgn-timepicker-input ' + hoursClass + '"' + hoursID + hoursName + ' minlength="2" maxlength="2">';
				hoursHTML += '	</div>';
				hoursHTML += '	<div class="prev"></div>';
				hoursHTML += '	</div>';
				var minutesHTML = '	<div class="minutes">';
				minutesHTML += '	<div class="next"></div>';
				minutesHTML += '	<div class="ti_tx">';
				minutesHTML += '	<input type="text" class="sgn-timepicker-input ' + minutesClass + '"' + minutesID + minutesName + ' minlength="2" maxlength="2">';
				minutesHTML += '	</div>';
				minutesHTML += '	<div class="prev"></div>';
				minutesHTML += '	</div>';
				var secondsHTML = '	<div class="seconds">';
				secondsHTML += '	<div class="next"></div>';
				secondsHTML += '	<div class="ti_tx">';
				secondsHTML += '	<input type="text" class="sgn-timepicker-input ' + secondsClass + '"' + secondsID + secondsName + ' minlength="2" maxlength="2">';
				secondsHTML += '	</div>';
				secondsHTML += '	<div class="prev"></div>';
				secondsHTML += '	</div>';
				var meridianHTML = '	<div class="meridian">';
				meridianHTML += '	<div class="next"></div>';
				meridianHTML += '	<div class="ti_tx">';
				meridianHTML += '	<input type="text" class="sgn-timepicker-input ' + meridianClass + '"' + meridianID + meridianName + ' minlength="2" maxlength="2" readonly>';
				meridianHTML += '	</div>';
				meridianHTML += '	<div class="prev"></div>';
				meridianHTML += '	</div>';

				var html = '<div class="sgn-timepicker">';
				var wrapHTML = '<div class="sgn-timepicker_wrap">';
				if(this.settings.heading)
					html += headingHTML;
				if(this.settings.hours)
					wrapHTML += hoursHTML;
				if(this.settings.hours && this.settings.minutes)
					wrapHTML += '<span></span>';
				if(this.settings.minutes)
					wrapHTML += minutesHTML;
				if((this.settings.minutes && this.settings.seconds) || (this.settings.hours && this.settings.seconds))
					wrapHTML += '<span></span>';
				if(this.settings.seconds)
					wrapHTML += secondsHTML;
				if(this.settings.meridian)
					wrapHTML += meridianHTML;
				wrapHTML += '</div>';
				html += wrapHTML;
				html += '</div>';
				$element.after(html);

				var $nextBtn = $(".sgn-timepicker > .sgn-timepicker_wrap > div > div.next"),
					$prevBtn = $(".sgn-timepicker > .sgn-timepicker_wrap > div > div.prev");

				var $hours    = $(".sgn-timepicker > .sgn-timepicker_wrap > .hours"),
					$minutes  = $(".sgn-timepicker > .sgn-timepicker_wrap > .minutes"),
					$seconds  = $(".sgn-timepicker > .sgn-timepicker_wrap > .seconds"),
					$meridian = $(".sgn-timepicker > .sgn-timepicker_wrap > .meridian");
				var $hoursInput    = $hours.find("input.sgn-timepicker-input"),
					$minutesInput  = $minutes.find("input.sgn-timepicker-input"),
					$secondsInput  = $seconds.find("input.sgn-timepicker-input"),
					$meridianInput = $meridian.find("input.sgn-timepicker-input");


				liveTimeInterval = setInterval(function() {
					var date = new Date(),
						h    = formatAMPM(date).h,
						m    = formatAMPM(date).i,
						s    = formatAMPM(date).s,
						A    = formatAMPM(date).A;
					$hoursInput.val(h);
					$minutesInput.val(m);
					$secondsInput.val(s);
					$meridianInput.val(A);
				}, 1000);
				setEvents(this.settings, $hours, $minutes, $seconds, $meridian, 0, $element);
			}

			$element.hide();
		},
		create: function(options) {
			var settings = $.extend({}, defaults, options);
			var _defaults = defaults;

		},
		parseUnixTimestamp: function(timestamp) {
			return parseUnixTimestamp(timestamp);
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};
})(jQuery, window, document);