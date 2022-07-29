/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

$.extend({
	"initWizardNav": function(e) {
		const eid = ".sgn-wizard-container .sgn-wizard > .sgn-wizard-navigation-wrapper > .wizard-navigation > li",
			  tid = ".sgn-wizard-container .sgn-wizard > .sgn-wizard-navigation-wrapper > .wizard-navigation > li.active";
		const el       = $(eid),
			  t        = $(tid),
			  $nextBtn = $(".sgn-wizard-nextBtn"),
			  $prevBtn = $(".sgn-wizard-prevBtn"),
			  $steps   = $('.sgn-wizard-container .sgn-wizard .sgn-wizard-steps-container > .sgn-wizard-step');
		el.each(function(i, c) {
			$(this).attr("step", (i + 1));
			$(this).parents().find(".sgn-wizard-steps-container > .sgn-wizard-step").eq(i).attr("step", (i + 1)).addClass("wizard");
		});
		//$('.sgn-wizard-steps-container > .sgn-wizard-step').first().addClass("current");
		$('.sgn-wizard-steps-container > .sgn-wizard-step[step="1"]').addClass("current start");
		$prevBtn.attr("disabled", true).addClass("disabled");

		$nextBtn.on("click", function(e) {
			e.preventDefault();
			$.nextStep();
		});

		$prevBtn.on("click", function(e) {
			e.preventDefault();
			$.prevStep();
		});

		$steps.each(function() {
			const $this = $(this);
			if($this.attr('sgn-wizard-scroll-amount') !== undefined) {
				$nextBtn.attr("disabled", true).addClass("disabled");

				$this.on('scroll', function() {
					let div = $(this).get(0);
					if(div.scrollTop + div.clientHeight >= (div.scrollHeight)) {
						$nextBtn.removeAttr("disabled").removeClass("disabled");
					}
				});
			}
		});
	},
	"prevStep": function(e) {
		var eid = ".sgn-wizard .sgn-wizard-navigation-wrapper > .wizard-navigation > li",
			tid = ".sgn-wizard .sgn-wizard-navigation-wrapper > .wizard-navigation > li.active";
		var peid  = ".sgn-wizard-step",
			paeid = ".sgn-wizard-step.current";
		var el = $(eid),
			t  = $(tid);
		var pe  = $(peid),
			pae = $(paeid);
		var l, p, n, c;
		l = (el.length);
		if(pae.prev(peid).length > 0) {
			if(t.length === 1) {
				c = t.attr("step");
				p = ((c - 1) < 1) ? 0 : (c - 1);
				n = ((c + 1) > l) ? c : (c + 1);
				if(p >= 1) {
					t.removeClass("active complete");
					t.next(eid).removeClass("active complete");
					t.prev(eid).removeClass("complete").addClass("active");
					if(p === 1)
						$(".sgn-wizard-prevBtn").attr("disabled", true).addClass("disabled");
					else
						$(".sgn-wizard-prevBtn").removeAttr("disabled").removeClass("disabled");
					if(c === l)
						$(".sgn-wizard-nextBtn").attr("disabled", true).addClass("disabled");
					else
						$("#sgn-wizard-nextBtn").removeAttr("disabled").removeClass("disabled");
					/*pae.removeClass("current").fadeOutRight(1000);
					setTimeout(function () {
						pae.hide();
						pae.prev(peid).show();
						pae.prev(peid).slideInLeft(1000);
						pae.prev(peid).addClass("current");
						$(".sgn-wizard-steps-container").data("sgn-wizard-current-step", pae.prev(peid).attr("step"));
					}, 1000);*/
					pae.removeClass('current complete start');
					pae.prev(peid).removeClass('complete').addClass("current");
					$(".sgn-wizard-steps-container").data("sgn-wizard-current-step", pae.prev(peid).attr("step"));
				} else
					t.attr("disabled", true);
			}
		}
	},
	"nextStep": function(e) {
		var eid = ".sgn-wizard .sgn-wizard-navigation-wrapper > .wizard-navigation > li",
			tid = ".sgn-wizard .sgn-wizard-navigation-wrapper > .wizard-navigation > li.active";
		var peid  = ".sgn-wizard-step",
			paeid = ".sgn-wizard-step.current";
		var el = $(eid),
			t  = $(tid);
		var pe  = $(peid),
			pae = $(paeid);
		var l, p, n, c;
		l = (el.length - 1);
		if(t.length === 1) {
			c = t.attr("step");
			p = ((c - 1) < 1) ? 1 : (c - 1);
			n = ((c + 1) > l) ? c : (c + 1);
			if(pae.next(peid).length > 0) {
				if(n <= l) {
					t.removeClass("active complete").addClass("complete");
					t.prev(eid).addClass("complete");
					t.next(eid).addClass("active");
					if(c === 1)
						$(".sgn-wizard-prevBtn").attr("disabled", true).addClass("disabled");
					else
						$(".sgn-wizard-prevBtn").removeAttr("disabled").removeClass("disabled");
					if(n === l)
						$(".sgn-wizard-nextBtn").attr("disabled", true).addClass("disabled");
					else
						$(".sgn-wizard-nextBtn").removeAttr("disabled").removeClass("disabled");
					/*pae.fadeOutLeft(1000);
					setTimeout(function () {
						pae.hide().removeClass("current");
						pae.next(peid).show();
						pae.next(peid).slideInRight(1000);
						pae.next(peid).addClass("current");
						$(".sgn-wizard-steps-container").data("sgn-wizard-current-step", pae.next(peid).attr("step"));
					}, 1000);*/
					pae.removeClass('current start').addClass('complete');
					pae.next(peid).removeClass('complete').addClass("current");
					$(".sgn-wizard-steps-container").data("sgn-wizard-current-step", pae.next(peid).attr("step"));
				} else
					t.attr("disabled", true);
			}
		}
	},
	"getStep": function(e) {
		var s = 0;
		var peid  = ".sgn-wizard-step",
			paeid = ".sgn-wizard-step.current";
		var pe  = $(peid),
			pae = $(paeid);
		if(pae.length === 1) {
			s = parseInt(pae.attr("step"));
		}
		return s;
	},
	"getNextStep": function(e) {
		var s = 0;
		var peid  = ".sgn-wizard-step",
			paeid = ".sgn-wizard-step.current";
		var pe  = $(peid),
			pae = $(paeid);
		s = ($.getStep() + 1);
		return s;
	},
	"getTotalSteps": function(e) {
		var peid  = ".sgn-wizard-step",
			paeid = ".sgn-wizard-step.current";
		var pe  = $(peid),
			pae = $(paeid);
		return pe.length;
	}
});

$(document).ready(function() {
	$.initWizardNav();
});
