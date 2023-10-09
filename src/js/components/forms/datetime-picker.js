/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

/*
 Inspired by: "Framer Android Picker"
 By: John Sherwin
 Link: https://dribbble.com/shots/4467822-Framer-Android-Picker
 Link: https://codepen.io/FilipVitas/pen/mLZepb
 */

const SGNRoller = function($element, classNames = "") {
	const _this = this;

	let $options,
	    dragging = false, length = 0, seleted = false, previousY = 0, position = 0, offset = 0,
	    $dragdealer, $selectedOption;

	const init = () => {
		$options = $element.children("li");
		const selectedAttr = $element.attr("data-selected");
		let $handle = $options.parent(".handle"),
		    $roller = $options.parent(".sgn-roller");

		if($roller.length > 0) {
			if(!$roller.hasClass("handle")) $roller.addClass("handle");
			$handle = $roller;
		} else {
			$options.wrapAll(`<ul class="handle"/>`);
			$handle = $options.parent(".handle");
		}
		length = $options.length;
		$handle.removeClass("sgn-roller");
		$handle.wrap(`<div class="dragdealer${classNames}"/>`);
		$dragdealer = $handle.parent(".dragdealer");

		$dragdealer[0].addEventListener("mousedown", onMouseDown);
		$dragdealer[0].addEventListener("touchstart", onMouseDown);
		$dragdealer[0].addEventListener("wheel", onWheel);

		if(selectedAttr !== undefined && selectedAttr !== null) {
			_this.setSelected(selectedAttr);
		}
	};
	const onWheel = (e) => {
		//e.wheelDelta>0?"top":"bottom";
		const delta = e.wheelDelta;

		offset = (delta > 0) ? 10 : -10;
		let maxPosition = -length * 50;
		let pos = position + offset;
		position = Math.max(maxPosition, Math.min(50, pos));

		maxPosition = -(length - 1) * 50;
		let rounderPosition = Math.round((position + offset * 5) / 50) * 50;
		let finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));
		position = finalPosition;

		const index = -finalPosition / 50;
		$selectedOption = $($options.get(index));
		setSelected(finalPosition);

		const styles = {
			willChange: "transform",
			transition: `transform ${Math.abs(offset) / 100 + 0.1}s`,
			transform: `translateY(${position}px)`
		};
		$element.css(styles);

		$element.trigger("sgnroller.wheelSelection", {element: $selectedOption, index: index, value: $selectedOption.text(), position: position});
	};
	const onMouseMove = (e) => {
		let clientY = e.touches ? e.touches[0].clientY : e.clientY;

		offset = clientY - previousY;

		let maxPosition = -length * 50;
		let pos = position + offset;

		position = Math.max(maxPosition, Math.min(50, pos));
		const styles = {
			willChange: "transform",
			transition: `transform ${Math.abs(offset) / 100 + 0.1}s`,
			transform: `translateY(${position}px)`
		};
		$element.css(styles);
		previousY = e.touches ? e.touches[0].clientY : e.clientY;
	};
	const onMouseUp = () => {
		// calculate closeset snap
		let maxPosition = -(length - 1) * 50;
		let rounderPosition = Math.round((position + offset * 5) / 50) * 50;
		let finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));

		dragging = false;
		position = finalPosition;

		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
		document.removeEventListener("touchmove", onMouseMove);
		document.removeEventListener("touchend", onMouseUp);

		const styles = {
			willChange: "transform",
			transition: `transform ${Math.abs(offset) / 100 + 0.1}s`,
			transform: `translateY(${position}px)`
		};
		$element.css(styles);

		const index = -finalPosition / 50;
		$selectedOption = $($options.get(index));
		setSelected(finalPosition);

		//this.props.onDateChange(this.props.type, -finalPosition / 50);
		offset = 0;
		dragging = false;

		$element.trigger("sgnroller.selectionEnd", {dragdealer: $dragdealer, handle: $element, option: $selectedOption, index: index, value: $selectedOption.text(), position: position});
	};
	const onMouseDown = (e) => {
		previousY = e.touches ? e.touches[0].clientY : e.clientY;
		dragging = true;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		document.addEventListener("touchmove", onMouseMove);
		document.addEventListener("touchend", onMouseUp);

		$element.trigger("sgnroller.selectionStart");
	};

	const setSelected = (position) => {
		const index = -position / 50;
		$selectedOption = $($options.get(index));
		$options.removeClass("selected");
		$selectedOption.addClass("selected");
		//console.default.log(position,index,$selectedOption,$options);

		const styles = {
			willChange: "transform",
			transition: `transform ${Math.abs(offset) / 100 + 0.1}s`,
			transform: `translateY(${position}px)`
		};
		$element.css(styles);
	};

	_this.setSelected = (key) => {
		const $selected = (key !== undefined && key !== null) ? $options.filter((i, o) => $(o).text().trim() === key.toString()) : undefined;
		const index = ($selected !== undefined && $selected.length > 0) ? $selected.index() + 1 : 1;
		let selectedPosition = -(index - 1) * 50;
		//console.default.log($element, key, $selected);
		if(!this.dragging && position !== selectedPosition) {
			position = selectedPosition;
			setSelected(position);
		}
	};

	_this.getSelected = () => $options.filter(".selected");
	_this.getSelectedIndex = () => _this.getSelected().index();
	_this.getSelectedValue = () => _this.getSelected().text();

	init();

	return _this;
};

const SGNDateTimePicker = function($element, type = "both", options) {
	type = (type === "both" || type === "date" || type === "time") ? type : "both";
	const _this = this,
	      date  = new Date();
	const _defaults = {
		locale: "en-US",
		//locale: "hi-IN",
		use24HourTime: false,
		format: {
			month: "short"
		}
	};
	_this.settings = $.extend(_defaults, options);
	date.setLocale(_this.settings.locale);
	_this.date = date;
	const d    = date.format("dd"),
	      m    = date.format("F"),
	      y    = date.format("Y"),
	      h    = date.format((!_this.settings.use24HourTime) ? "hh" : "HH"),
	      i    = date.format("ii"),
	      s    = date.format("ss"),
	      a    = date.format("AA"),
	      atxt = (!_this.settings.use24HourTime) ? ` ${a}` : "";

	const MONTHS    = _this.date.getMonthsMap((_this.settings.format.month === "short")),
	      YEARS     = _this.date.getYearsMap(),
	      DAYS      = _this.date.getDatesMap(),
	      HOURS     = _this.date.getHoursMap(),
	      MINUTES   = _this.date.getMinutesMap(),
	      SECONDS   = _this.date.getSecondsMap(),
	      MERIDIANS = _this.date.getMeridiansMap();

	const full_date      = `${d} ${m} ${y}`,
	      full_time      = `${h}:${i}:${s}${atxt}`,
	      full_date_time = full_date + " " + full_time;

	let $datePicker, $date, $rollers;
	let clockInterval;
	let selectedValue = undefined, selectedTimestamp = undefined, selectedDateTime = undefined;

	function GUID(uppercase = true, hyphen = true) {
		let result, i, j;
		result = '';
		for(j = 0; j < 32; j++) {
			if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20)) result = result + '-';
			i = Math.floor(Math.random() * 16).toString(16);
			i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
			result = result + i;
		}
		return result;
	}

	const init = () => {
		const years  = YEARS.map(year => `<li>${year}</li>`).join(""),
		      months = MONTHS.map(month => `<li>${month}</li>`).join(""),
		      days   = DAYS.map(day => `<li>${day}</li>`).join("");
		const hours     = HOURS.map(hour => `<li>${hour}</li>`).join(""),
		      minutes   = MINUTES.map(minute => `<li>${minute}</li>`).join(""),
		      seconds   = SECONDS.map(second => `<li>${second}</li>`).join(""),
		      meridians = Object.values(MERIDIANS).map(meridian => `<li>${meridian}</li>`).join("");
		const title           = (type === "date") ? "Date" : ((type === "time") ? "Time" : "Date & Time"),
		      wrapperClass    = (type === "date") ? "date" : ((type === "time") ? "time" : "date-time"),
		      currentDateTime = (type === "date") ? full_date : ((type === "time") ? full_time : full_date_time),
		      modalGUID       = 'sgn-date-picker-' + GUID();

		$element.attr("type", "text");

		const meridianHTML = (!_this.settings.use24HourTime) ? `<ul class="sgn-roller meridian" data-selected="${a}">${meridians}</ul>` : "";
		const datePickerHTML = `<div class="picker date-picker"><ul class="sgn-roller dates" data-selected="${d}">${days}</ul><ul class="sgn-roller months" data-selected="${m}">${months}</ul><ul class="sgn-roller years" data-selected="${y}">${years}</ul></div>`,
		      timePickerHTML = `<div class="picker time-picker"><ul class="sgn-roller hours" data-selected="${h}">${hours}</ul><ul class="sgn-roller minutes" data-selected="${i}">${minutes}</ul><ul class="sgn-roller seconds" data-selected="${s}">${seconds}</ul>${meridianHTML}</div>`;
		const dateTimePickerHTML = datePickerHTML + timePickerHTML,
		      pickerHTML         = (type === "date") ? datePickerHTML : ((type === "time") ? timePickerHTML : dateTimePickerHTML);
		const headingTXT = getI18nString('sgnuk_txt_date_picker_heading', title);

		const html      = `<div class="current-date-time ${wrapperClass}">${currentDateTime}</div><div class="picker-wrapper">${pickerHTML}</div>`,
		      modalHTML = `<div class="sgn-modal sgn-date-picker-modal" id="${modalGUID}">
							\t\t\t\t\t\t<div class="sgn-modal-header"><div class="sgn-modal-heading">${headingTXT} Picker</div><a class="btn danger outline icon sm sgn-modal-cancelBtn"><i class="fas fa-times"></i></a></div>
							\t\t\t\t\t\t<div class="sgn-modal-body">
							\t\t\t\t\t\t\t<div class="sgn-date-picker">${html}</div>
							\t\t\t\t\t\t</div>
							\t\t\t\t\t\t<div class="sgn-modal-footer"><a class="btn primary sgn-modal-continueBtn">{{sgnuk_txt_date_picker_positive_button|Confirm}}</a></div>
							\t\t\t\t\t</div>`;
		if($element.hasClass('form-control')) {
			$element.parents('.sgn-form').parent().append(modalHTML);
			const $modal = $(`#${modalGUID}`);
			$datePicker = $modal.children('.sgn-modal-body').children(".sgn-date-picker");
			$modal.on('sgn.modal.onPositiveButtonClick', () => {
				$element.trigger("sgn.datepicker.onDateSelected", {timestamp: selectedTimestamp, date: selectedDateTime});
				$element.val(selectedValue).trigger("change", {timestamp: selectedTimestamp, date: selectedDateTime});
				$modal.SGNModal().close();
			});
			$element.on('focus', () => $modal.SGNModal().show());
		} else {
			$element.wrap(`<div class="sgn-date-picker"/>`);
			$datePicker = $element.parent(".sgn-date-picker");
			$datePicker.append(html);
		}
		$rollers = $datePicker.find(".sgn-roller");
		$rollers.SGNRoller();
		$date = $datePicker.find(".current-date-time");
		//startClock();
		$rollers.on("sgnroller.selectionStart", (e) => stopClock());
		$rollers.on("sgnroller.selectionEnd", function(e) {
			const date = new Date();
			const $this          = $(this),
			      $picker        = e.detail.dragdealer.parent(".picker"),
			      $pickerWrapper = $picker.parents(".picker-wrapper"),
			      $dragdealers   = $pickerWrapper.find(".dragdealer"),
			      $date          = $datePicker.children(".date"),
			      $time          = $datePicker.children(".time"),
			      $datetime      = $datePicker.children(".date-time");
			if($date.length === 1) {
				const $dateHandle  = $dragdealers.children(".handle.dates"),
				      $monthHandle = $dragdealers.children(".handle.months"),
				      $yearHandle  = $dragdealers.children(".handle.years");
				const dateSelected  = $dateHandle.SGNRoller().getSelectedValue(),
				      monthSelected = $monthHandle.SGNRoller().getSelectedValue(),
				      yearSelected  = $yearHandle.SGNRoller().getSelectedValue();
				selectedValue = `${dateSelected}-${monthSelected}-${yearSelected}`;
				selectedTimestamp = date.toTime(selectedValue);
				selectedDateTime = new Date(selectedTimestamp * 1000);
				$date.html(selectedDateTime.format("dd F Y"));
			} else if($time.length === 1) {
				const $hourHandle     = $dragdealers.children(".handle.hours"),
				      $minuteHandle   = $dragdealers.children(".handle.minutes"),
				      $secondHandle   = $dragdealers.children(".handle.seconds"),
				      $meridianHandle = $dragdealers.children(".handle.meridian");
				const hourSelected     = $hourHandle.SGNRoller().getSelectedValue(),
				      minuteSelected   = $minuteHandle.SGNRoller().getSelectedValue(),
				      secondSelected   = $secondHandle.SGNRoller().getSelectedValue(),
				      meridianSelected = (!empty($meridianHandle.SGNRoller().getSelectedValue())) ? ` ${$meridianHandle.SGNRoller().getSelectedValue()}` : "";
				selectedValue = `${hourSelected}:${minuteSelected}:${secondSelected}${meridianSelected}`;
				selectedTimestamp = date.toTime(selectedValue);
				selectedDateTime = new Date(selectedTimestamp * 1000);
				$time.html(selectedDateTime.format("hh:ii:ss AA"));
			} else if($datetime.length === 1) {
				const $dateHandle     = $dragdealers.children(".handle.dates"),
				      $monthHandle    = $dragdealers.children(".handle.months"),
				      $yearHandle     = $dragdealers.children(".handle.years"),
				      $hourHandle     = $dragdealers.children(".handle.hours"),
				      $minuteHandle   = $dragdealers.children(".handle.minutes"),
				      $secondHandle   = $dragdealers.children(".handle.seconds"),
				      $meridianHandle = $dragdealers.children(".handle.meridian");
				const dateSelected     = $dateHandle.SGNRoller().getSelectedValue(),
				      monthSelected    = $monthHandle.SGNRoller().getSelectedValue(),
				      yearSelected     = $yearHandle.SGNRoller().getSelectedValue(),
				      hourSelected     = $hourHandle.SGNRoller().getSelectedValue(),
				      minuteSelected   = $minuteHandle.SGNRoller().getSelectedValue(),
				      secondSelected   = $secondHandle.SGNRoller().getSelectedValue(),
				      meridianSelected = (!empty($meridianHandle.SGNRoller().getSelectedValue())) ? ` ${$meridianHandle.SGNRoller().getSelectedValue()}` : "";
				selectedValue = `${dateSelected}-${monthSelected}-${yearSelected} ${hourSelected}:${minuteSelected}:${secondSelected}${meridianSelected}`;
				selectedTimestamp = date.toTime(selectedValue);
				selectedDateTime = new Date(selectedTimestamp * 1000);
				$datetime.html(selectedDateTime.format("dd F Y hh:ii:ss AA"));
				//console.default.log($hourHandle,hourSelected, selectedValue);
			}
			//setTimeout(() => startClock(), 10000);
			$element.trigger("sgn.datepicker.onDateSelected", {timestamp: selectedTimestamp, date: selectedDateTime});
			$element.val(selectedValue).trigger("change", {timestamp: selectedTimestamp, date: selectedDateTime});
		});
	};

	const startClock = () => {
		clockInterval = setInterval(() => {
			const date = new Date();
			date.setLocale(_this.settings.locale);
			const d    = date.format("dd"),
			      m    = date.format("F"),
			      y    = date.format("Y"),
			      h    = date.format((!_this.settings.use24HourTime) ? "hh" : "HH"),
			      i    = date.format("ii"),
			      s    = date.format("ss"),
			      a    = date.format("AA"),
			      atxt = (!_this.settings.use24HourTime) ? ` ${a}` : "";
			const full_date      = `${d} ${m} ${y}`,
			      full_time      = `${h}:${i}:${s}${atxt}`,
			      full_date_time = full_date + " " + full_time;

			selectedValue = (type === "date") ? full_date : ((type === "time") ? full_time : full_date_time);

			$date.html(selectedValue);
			const $dateRoller     = $rollers.filter(".dates"),
			      $monthRoller    = $rollers.filter(".months"),
			      $yearRoller     = $rollers.filter(".years"),
			      $hourRoller     = $rollers.filter(".hours"),
			      $minuteRoller   = $rollers.filter(".minutes"),
			      $secondRoller   = $rollers.filter(".seconds"),
			      $meridianRoller = $rollers.filter(".meridians");

			$dateRoller.SGNRoller().setSelected(d);
			$monthRoller.SGNRoller().setSelected(m);
			$yearRoller.SGNRoller().setSelected(y);
			$hourRoller.SGNRoller().setSelected(h);
			$minuteRoller.SGNRoller().setSelected(i);
			$secondRoller.SGNRoller().setSelected(s);
			$meridianRoller.SGNRoller().setSelected(a);
			//$hourRoller.SGNRoller().setSelected(h);
			//console.default.log($hourRoller,h);

			selectedDateTime = new Date(selectedValue * 1000);
			selectedTimestamp = selectedDateTime.toTime(selectedValue);
		}, 1000);
	};

	const stopClock = () => clearInterval(clockInterval);

	_this.getSelectedValue = () => $date.text();
	_this.getSelectedTimestamp = () => date.toTime($date.text());
	_this.getSelectedDateTime = () => new Date(_this.getSelectedTimestamp());

	init();

	return _this;
};

$.fn.SGNRoller = function() {
	const _this  = this,
	      $_this = $(this);

	const init = () => {
		return $_this.each(function() {
			const $this = $(this);
			const plugin = ($this.data("SGNRoller") === undefined) ? new SGNRoller($(this)) : $this.data("SGNRoller");
			$this.data("SGNRoller", plugin);
			//$this[0].data('SGNRoller', plugin);
		});
	};
	_this.setSelected = (key) => {
		return $_this.each(function() {
			const $this = $(this);
			const plugin = $this.data("SGNRoller");
			plugin.setSelected(key);
		});
	};
	_this.getSelected = () => {
		const plugin = $_this.data("SGNRoller");
		return (typeof plugin !== "undefined") ? plugin.getSelected() : undefined;
	};
	_this.getSelectedIndex = () => {
		const plugin = $_this.data("SGNRoller");
		return (typeof plugin !== "undefined") ? plugin.getSelectedIndex() : undefined;
	};
	_this.getSelectedValue = () => {
		const plugin = $_this.data("SGNRoller");
		return (typeof plugin !== "undefined") ? plugin.getSelectedValue() : undefined;
	};

	init();

	return _this;
};

$.fn.SGNDateTimePicker = function(options) {
	const _this  = this,
	      $_this = $(this);

	const init = () => {
		return $_this.each(function() {
			const $this = $(this);
			const plugin = ($this.data("SGNDateTimePicker") === undefined) ? new SGNDateTimePicker($(this), "both", options) : $this.data("SGNDateTimePicker");
			$this.data("SGNDateTimePicker", plugin);
		});
	};
	_this.getSelectedValue = () => {
		const plugin = $_this.data("SGNDateTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedValue() : undefined;
	};
	_this.getSelectedTimestamp = () => {
		const plugin = $_this.data("SGNDateTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedTimestamp() : undefined;
	};
	_this.getSelectedDateTime = () => {
		const plugin = $_this.data("SGNDateTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedDateTime() : undefined;
	};

	init();

	return _this;
};

$.fn.SGNDatePicker = function(options) {
	const _this  = this,
	      $_this = $(this);

	const init = () => {
		return $_this.each(function() {
			const $this = $(this);
			const plugin = ($this.data("SGNDatePicker") === undefined) ? new SGNDateTimePicker($(this), "date", options) : $this.data("SGNDatePicker");
			$this.data("SGNDatePicker", plugin);
		});
	};
	_this.getSelectedValue = () => {
		const plugin = $_this.data("SGNDatePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedValue() : undefined;
	};
	_this.getSelectedTimestamp = () => {
		const plugin = $_this.data("SGNDatePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedTimestamp() : undefined;
	};
	_this.getSelectedDateTime = () => {
		const plugin = $_this.data("SGNDatePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedDateTime() : undefined;
	};

	init();

	return _this;
};

$.fn.SGNTimePicker = function(options) {
	const _this  = this,
	      $_this = $(this);

	const init = () => {
		return $_this.each(function() {
			const $this = $(this);
			const plugin = ($this.data("SGNTimePicker") === undefined) ? new SGNDateTimePicker($(this), "time", options) : $this.data("SGNTimePicker");
			$this.data("SGNTimePicker", plugin);
		});
	};
	_this.getSelectedValue = () => {
		const plugin = $_this.data("SGNTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedValue() : undefined;
	};
	_this.getSelectedTimestamp = () => {
		const plugin = $_this.data("SGNTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedTimestamp() : undefined;
	};
	_this.getSelectedDateTime = () => {
		const plugin = $_this.data("SGNTimePicker");
		return (typeof plugin !== "undefined") ? plugin.getSelectedDateTime() : undefined;
	};

	init();

	return _this;
};

SUKR(() => {
	const $dateTimePickers = $("input[type=datetime], input[type=datetime-local]"),
	      $datePickers     = $("input[type=date]");
	$timePickers = $("input[type=time]");

	$dateTimePickers.SGNDateTimePicker();
	$datePickers.SGNDatePicker();
	$timePickers.SGNTimePicker();
});
