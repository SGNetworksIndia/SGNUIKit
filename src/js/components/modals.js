/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNModals requires jQuery");
}

(function(window, document, $) {
	"use strict";

	const SGNModal = function($elem) {
		const plugin = this;
		let $this = $elem;

		const init = () => {
			const $body   = $this.children(".sgn-modal-body"),
			      $footer = $this.find(".sgn-modal-footer");
			const $cancelBtn   = $this.find(".sgn-modal-cancelBtn"),
			      $continueBtn = $this.find(".sgn-modal-continueBtn");

			const cancelBtnHTML   = `<a class="btn btn-text primary sgn-modal-cancelBtn">Cancel</a>`,
			      continueBtnHTML = `<a class="btn primary sgn-modal-continueBtn">Continue</a>`;

			let createCancelBtn = false, createContinueBtn = false;

			if($cancelBtn.length <= 0 && !$this.hasClass('sgn-loading-dialog') && $this.parents('.sgn-loading-dialog').length <= 0) {
				if($footer.length > 0)
					$footer.append(cancelBtnHTML);
				else if($body.length > 0)
					$body.append(cancelBtnHTML);
				else
					createCancelBtn = true;
			}
			if($continueBtn.length <= 0 && !$this.hasClass('sgn-loading-dialog') && $this.parents('.sgn-loading-dialog').length <= 0) {
				if($footer.length > 0)
					$footer.append(continueBtnHTML);
				else if($body.length > 0)
					$body.append(continueBtnHTML);
				else
					createContinueBtn = true;
			}

			if(createCancelBtn && createCancelBtn)
				$this.append(cancelBtnHTML).append(continueBtnHTML).wrapAll(`<div class="sgn-modal-footer"/>`);
			else if(createCancelBtn)
				$this.append(cancelBtnHTML).wrap(`<div class="sgn-modal-footer"/>`);
			else if(createContinueBtn)
				$this.append(continueBtnHTML).wrap(`<div class="sgn-modal-footer"/>`);

			if((!$this.hasClass('sgn-modal-wrapper') && $this.hasClass('sgn-modal')) && $this.parent('.sgn-modal-wrapper').length <= 0)
				$this.wrap('<div class="sgn-modal-wrapper" />');
			const $wrapper = $this.parent('.sgn-modal-wrapper');

			if($this.hasClass('sgn-modal-wrapper') && $this.children('.sgn-modal').length === 1)
				$this = $this.children('.sgn-modal');

			$this.parent('.sgn-modal-wrapper').hide().removeClass('show').addClass('hide');

			$wrapper.on('click', function(e) {
				e.preventDefault();
				plugin.hide();
				$this.trigger('sgn.modal.onBackdropClick');
			});

			$this.find('.sgn-modal-cancelBtn').on('click', function(e) {
				e.preventDefault();
				plugin.hide();
				$this.trigger('sgn.modal.onNegativeButtonClick');
			});

			$this.find('.sgn-modal-continueBtn').on('click', function(e) {
				e.preventDefault();
				plugin.hide();
				$this.trigger('sgn.modal.onPositiveButtonClick');
			});

			$this.data('SGNModal', plugin);
		};

		plugin.elem = $this;

		plugin.show = () => {
			$this.parent(".sgn-modal-wrapper").show().css("display", "flex");
			setTimeout(() => $this.parent(".sgn-modal-wrapper").removeClass("hide").addClass("show"), 50);
		};

		plugin.hide = () => {
			$this.parent(".sgn-modal-wrapper").removeClass("show").addClass("hide");
			setTimeout(() => $this.parent(".sgn-modal-wrapper").hide(), 400);
		};

		plugin.remove = () => {
			$this.SGNModal.hide();
			$this.parent(".sgn-modal-wrapper").remove();

			$this.removeData("SGNModal");
		};

		if($this.data("SGNModal") === undefined)
			init();
	}

	/*
	 var pluginContainer = $("#divSomeContainer");
	 pluginContainer.MyPlugin();
	 pluginContainer.MyPlugin().DoSomething();
	 */

	/***
	 * Create a new <b><i>SGNModal</b></i> or reuse the old <b><i>SGNModal</b></i> instance for the specific element.
	 *
	 * @returns {jQuery.SGNModal}
	 * @constructor
	 */
	$.fn.SGNModal = function() {
		const _this = this;
		const $this = $(_this);

		const init = () => new SGNModal($this);

		/***
		 * Show the currently selected <b><i>SGNModal</b></i>.
		 *
		 * @returns {jQuery.SGNModal}
		 */
		this.show = function() {
			const plugin = $(this).data("SGNModal");
			if(plugin !== undefined)
				plugin.show();

			return this;
		};

		/***
		 * Show the currently selected <b><i>SGNModal</b></i>.
		 *
		 * @returns {jQuery.SGNModal}
		 */
		this.open = function() {
			const plugin = $(this).data("SGNModal");
			if(plugin !== undefined)
				plugin.show();

			return this;
		};

		/***
		 * Hide the currently selected <b><i>SGNModal</b></i>.
		 *
		 * @returns {jQuery.SGNModal}
		 */
		this.hide = function() {
			const plugin = $(this).data("SGNModal");
			if(plugin !== undefined)
				plugin.hide();

			return this;
		};

		/***
		 * Hide the currently selected <b><i>SGNModal</b></i>.
		 *
		 * @returns {jQuery.SGNModal}
		 */
		this.close = function() {
			const plugin = $(this).data("SGNModal");
			if(plugin !== undefined)
				plugin.hide();

			return this;
		};

		/***
		 * Completely remove the currently selected <b><i>SGNModal</b></i>.
		 *
		 * @returns {jQuery.SGNModal}
		 */
		this.remove = function() {
			const plugin = $(this).data("SGNModal");
			if(plugin !== undefined)
				plugin.remove();

			return this;
		};

		if($this.data("SGNModal") === undefined)
			init();

		return this;
	};

	SUKR(() => {
		const $modals = $(".sgn-modal");
		const $modalTargetToggle = $("[sgn-modal], [data-sgn-modal], [data-modal]");

		if($modals.length > 0) {
			$modals.each(function() {
				const $this = $(this);
				$this.SGNModal();
			});

			$modalTargetToggle.on("click", function(e) {
				e.preventDefault();
				const t = ($(this).attr("sgn-modal") !== undefined) ? $(this).attr("sgn-modal") : (($(this).attr("data-sgn-modal") !== undefined) ? $(this).attr("data-sgn-modal") : $(this).attr("data-modal"));
				const $t = $(t);
				$t.SGNModal().show();
			});
		}
	});

	return this;
}(window, document, jQuery));
