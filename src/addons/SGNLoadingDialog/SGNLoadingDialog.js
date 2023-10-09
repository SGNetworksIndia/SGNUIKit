(function($) {
	var SGNLoadingDialog = function(options) {
		var pluginName = "jquery.SGNLoadingDialog";
		var dialog        = $(".sgn-loading-dialog"),
		    dialogContent = $(".sgn-loading-dialog_content"),
		    dialogBody    = dialog.find(".modal-body");
		var defaults = {
			headerText: 'Loading',
			headerImageUrl: '',
			headerSize: 3,
			headerClass: '',
			message: 'Please wait...',
			dialogType: 'default',
			dialogSize: 'm',
			backdrop: false,
			progressStyle: 'striped indeterminate',
			progressType: 'default',
			contentElement: 'h3',
			contentClass: 'content',
			onHide: null,
			onShow: null,
			onCreate: function(el, spinner) {}
		}
		var _options = {
			headerText: null,
			headerImageUrl: null,
			headerSize: null,
			headerClass: null,
			message: null,
			backdrop: [
				true, false
			],
			dialogSize: ['s', 'm', 'l'],
			dialogType: [
				'default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'
			],
			progressStyle: [
				'default', 'striped', 'indeterminate'
			],
			progressType: [
				'default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'
			],
			contentElement: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
			contentClass: null,
			onHide: null,
			onShow: null,
			onCreate: null
		};
		const plugin = this;
		plugin.settings = {}

		plugin.init = function() {
			if(typeof options !== 'undefined') {
				if(options.hasOwnProperty('contentClass'))
					options.contentClass = options.contentClass.replace('content', '');
				if(!options.hasOwnProperty('dialogType'))
					options.dialogType = defaults.dialogType;
				if(!options.hasOwnProperty('progressType'))
					options.progressType = options.dialogType;
			}
			plugin.settings = $.extend(defaults, options);
			$.each(plugin.settings, function(k, v) {
				if(typeof v === 'function') {
					if(_options.hasOwnProperty(k)) {
						_checked = true;
					} else {
						_checked = false;
						$.error(`Invalid callback for: '${k}' in ${pluginName}`);
					}
				} else if(typeof v === 'string') {
					$.each(_options, function(k2, v2) {
						if(k == k2) {
							if(v2 === null) {
								_checked = true;
							} else {
								if(k === 'progressStyle') {
									$.each(v.split(' '), function(k3, v3) {
										if($.inArray(v3, _options[k]) !== -1) {
											_checked = true;
										} else {
											_checked = false;
											$.error(`Invalid value: '${v3}' for option: '${k}' in ${pluginName}`);
										}
									});
								} else if(k === 'dialogType') {
									if($.inArray(v, _options[k]) === -1) {
										plugin.settings.dialogType = defaults.dialogType;
									}
									_checked = true;
								} else if(k === 'progressType') {
									if($.inArray(v, _options[k]) === -1) {
										options.progressType = defaults.progressType;
									}
									if(v !== plugin.settings.dialogType) {
										plugin.settings.progressType = plugin.settings.dialogType
									}
									_checked = true;
								} else {
									if($.inArray(v, _options[k]) !== -1) {
										_checked = true;
									} else {
										_checked = false;
										$.error(`Invalid value: '${v}' for option: '${k}' in ${pluginName}`);
									}
								}
							}
						}
					});

				}
			});
			if(_checked) {
				create();
			}
		}
		const create = function() {
			var dialogTypeClass = (plugin.settings.dialogType) ? plugin.settings.dialogType : defaults.dialogType;
			var dialogSizeClass = (plugin.settings.dialogSize) ? `modal-${plugin.settings.dialogSize}` : `modal-${defaults.dialogSize}`;
			var progressTypeClass = (plugin.settings.progressType) ? plugin.settings.progressType : defaults.progressType;
			var progressStyleClass = (plugin.settings.progressStyle) ? plugin.settings.progressStyle : defaults.progressStyle;
			var hasBackdrop = (plugin.settings.backdrop) ? plugin.settings.backdrop : defaults.backdrop;

			var _headerClass = (plugin.settings.headerClass) ? plugin.settings.headerClass : defaults.headerClass;
			var headerClassAttr = (_headerClass) ? ' class="' + _headerClass + '"' : '';
			var headerContent = (plugin.settings.headerImageUrl) ? '<img src="' + plugin.settings.headerImageUrl + '"/>' : defaults.headerText;
			var header = (plugin.settings.headerSize) ?
			             '<h' + plugin.settings.headerSize + ' style="margin:0; text-align: center;width: 100%;"' + headerClassAttr + '>' + headerContent + '</h' + plugin.settings.headerSize + '>' :
			             '<h' + defaults.headerSize + ' style="margin:0"' + headerClassAttr + '>' + headerContent + '</h' + defaults.headerSize + '>';

			var _contentClass = (plugin.settings.contentClass) ? plugin.settings.contentClass : defaults.contentClass;
			var contentClassAttr = (_contentClass) ? ' class="' + _contentClass + '"' : '';
			var contentContent = (plugin.settings.message) ? plugin.settings.message : defaults.message;
			var content = (plugin.settings.contentElement) ? '<' + plugin.settings.contentElement + contentClassAttr + '>' + contentContent + '</' + plugin.settings.contentElement + '>' : '<' + defaults.contentElement + contentClassAttr + '>' + contentContent + '</' + defaults.contentElement + '>';

			//var tmpl = '<div class="modal fade sgn-loading-dialog" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;"></div>';
			/*var tmplBody='<div class="modal-dialog '+dialogSizeClass+'">' +
			 '<div class="modal-content">' +
			 '<div class="modal-header">'+header+'</div>'+
			 '<div class="modal-body"><div class="sgn-loading-dialog_content">'+content+'</div>'+
			 '<div class="progress" style="margin-bottom:0;">' +
			 '<div class="progress-bar '+progressStyleClass+'" style="width: 100%"></div>' +
			 '</div>' +
			 '</div>' +
			 '</div>' +
			 '</div>';*/
			const tmplBody = `<div class="sgn-modal-header">${header}</div>` +
			                 `<div class="sgn-modal-body"><div class="sgn-loading-dialog_content">${content}</div>` +
			                 `<div class="progress ${progressTypeClass}">` +
			                 `<div class="progress-bar ${progressStyleClass}"></div>` +
			                 '</div>' +
			                 '</div>';
			$("<div>")
				.attr("class", `sgn-modal fade sgn-loading-dialog ${dialogTypeClass} ${dialogSizeClass}`)
				.attr("data-backdrop", hasBackdrop)
				.attr("tabindex", "-1")
				.attr("role", (hasBackdrop) ? "modal" : "dialog")
				.html(tmplBody)
				.appendTo("body");
			dialog = $(".sgn-loading-dialog");
			//document.write(tmpl);
		}
		plugin.show = function(msg) {
			if(typeof msg != "undefined") {
				plugin.settings.message = msg;
				var contentContent = msg;
				var _contentClass = (plugin.settings.contentClass) ? plugin.settings.contentClass : defaults.contentClass;
				var contentClassAttr = (_contentClass) ? ' class="' + _contentClass + '"' : '';
				var content = (plugin.settings.contentElement) ?
				              '<' + plugin.settings.contentElement + contentClassAttr + '>' + contentContent + '</' + plugin.settings.contentElement + '>' :
				              '<' + defaults.contentElement + contentClassAttr + '>' + contentContent + '</' + defaults.contentElement + '>';
				const dialogContent = dialog.children('.sgn-modal-body').children('.sgn-loading-dialog_content').html(content);
			}
			dialog.SGNModal().show();
		}
		plugin.hide = function() {
			dialog.modal('hide');
			//$(".modal-backdrop").removeClass("show");
			$(".modal-backdrop").remove();
			dialog.removeClass("show");
			dialog.hide();
		}
		plugin.remove = function() {
			dialog.remove();
			$(".modal-backdrop").remove();
		}
	}

	$.SGNLoadingDialog = function(options) {
		var _this = this;
		var _plugin = new SGNLoadingDialog(options);
		this.initialize = function() {
			_plugin.init(options);
			return this;
		}
		this.show = function(msg) {
			_plugin.show(msg);
		}
		this.hide = function() {
			_plugin.hide();
		}
		this.remove = function() {
			_plugin.remove();
		}
		/*if (typeof options !== 'undefined')
		 return this.initialize();*/
		return this.initialize();
	}

	return this;
})(jQuery);
