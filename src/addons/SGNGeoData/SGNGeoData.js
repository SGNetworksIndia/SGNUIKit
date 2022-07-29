/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
//Make sure jQuery has been loaded before CTPLERP.js
if(typeof jQuery === "undefined") {
	throw new Error("SGNGeoData requires jQuery");
}

(function($) {
	"use strict";
	const _pluginName    = "SGNGeoData",
		  _pluginVersion = "1.0.0";

	const SGNGeoData = function(country, state, city, options) {
		const $country = $(country),
			  $state   = $(state),
			  $city    = $(city);
		const plugin = this;
		const _defaults = {
			deployment: 'local',
			showFlags: true
		}, _options     = {
			deployment: ['local', 'public'],
			showFlags: [true, false],
			onLoading: function() {},
			onLoaded: function() {}
		};
		plugin.settings = {}

		plugin.init = function(args) {
			let _checked = false;
			plugin.settings = $.extend(_defaults, args);
			$.each(plugin.settings, function(k, v) {
				if(typeof v === 'function') {
					if(_options.hasOwnProperty(k)) {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid callback for: ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				} else if(typeof v === 'string') {
					if($.inArray(v, _options[k]) !== -1 || _options[k] === ':string') {
						_checked = true;
					} else {
						_checked = false;
						$.error('Invalid value: ' + v + ' for option: ' + k + ' in jQuery.' + _pluginName + ' v' + _pluginVersion);
					}
				}
			});
			if(_checked) {
				if(plugin.settings.deployment === 'public') {
					plugin.settings.url = '//sgn.heliohost.org/api/geodata';
				} else {
					plugin.settings.url = '//sgnetworks.net/api/geodata';
				}
				bindEvents();
				plugin.loadCountries();
			}
		}
		//PUBLIC METHODS
		plugin.loadCountries = function() {
			const o = plugin.settings;
			if(typeof o.onLoading === "function")
				o.onLoading("country", $country);
			const data = {
				show_flag: o.showFlags
			};
			ajax(data, function(status, d) {
				if(status) {
					$country.html(d).SGNGFSelect('update');
					if(typeof o.onLoaded === "function")
						o.onLoaded("country", $country, d);
					$country.trigger('sgngeodataloaded', $country, d);
				}
			});
		}
		plugin.loadStates = function(countryID) {
			const o = plugin.settings;
			if(typeof o.onLoading === "function")
				o.onLoading("state", $state);
			const data = {
				show_flag: o.showFlags,
				country: countryID
			};
			ajax(data, function(status, d) {
				if(status) {
					$state.html(d).SGNGFSelect('update');
					if(typeof o.onLoaded === "function")
						o.onLoaded("state", $state, d);
					$state.trigger('sgngeodataloaded', $state, d);
				}
			});
		}
		plugin.loadCities = function(countryID, stateID) {
			const o = plugin.settings;
			if(typeof o.onLoading === "function")
				o.onLoading("city", $city);
			const data = {
				show_flag: o.showFlags,
				country: countryID,
				state: stateID
			};
			ajax(data, function(status, d) {
				if(status) {
					$city.html(d).SGNGFSelect('update');
					if(typeof o.onLoaded === "function")
						o.onLoaded("city", $city, d);
					$city.trigger('sgngeodataloaded', $city, d);
				}
			});
		}

		//PRIVATE METHODS
		const bindEvents = function() {
			const o = plugin.settings;
			$country.on('change.' + _pluginName, function(e) {
				const id = $(this).find('option:selected').attr('id');
				plugin.loadStates(id);
			});
			$state.on('change.' + _pluginName, function(e) {
				const cid = $country.find('option:selected').attr('id'),
					  id  = $(this).find('option:selected').attr('id');
				plugin.loadCities(cid, id);
			});
		}
		const ajax = function(data, callback) {
			$.ajax({
				type: 'post',
				url: plugin.settings.url,
				data: data,
				success: function(d) {
					callback(true, d);
				},
				error: function(xhr) {
					console.log(xhr.statusCode, xhr.statusText);
					callback(false, xhr);
				}
			});
		};
	}
	$.SGNGeoData = function($country, $state, $city, options) {
		const _this   = this,
			  _plugin = new SGNGeoData($country, $state, $city, options);

		_this.init = function(args) {
			_plugin.init(args);
		}
		_this.loadCountries = function() {
			_plugin.loadCountries();
		}
		_this.loadStates = function(countryID) {
			_plugin.loadStates(countryID);
		}
		_this.loadCities = function(countryID, stateID) {
			_plugin.loadCities(countryID, stateID);
		}
		_this.init(options);
		return _this;
	}
}(jQuery));
