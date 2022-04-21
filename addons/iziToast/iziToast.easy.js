"use strict";
if(typeof jQuery === "undefined") {
	throw new Error("CTPLERPCore requires jQuery");
}
/*if(typeof iziToast === "undefined") {
	throw new Error("CTPLERPCore requires iziToast");
}*/


$(function(SGNUIKitConfig) {
	"use strict";
	izitoast_setup();

	const ENVIRONMENT_DEVELOPMENT = 'Development';

	$.extend({
		alert: {
			success: function(productionMsg, developmentMsg) {
				const msg = ((SGNUIKitConfig.environment === ENVIRONMENT_DEVELOPMENT || productionMsg === undefined) && developmentMsg !== undefined) ? developmentMsg : productionMsg;
				izitoast_notify('success', msg);
			},
			info: function(productionMsg, developmentMsg) {
				const msg = ((SGNUIKitConfig.environment === ENVIRONMENT_DEVELOPMENT || productionMsg === undefined) && developmentMsg !== undefined) ? developmentMsg : productionMsg;
				izitoast_notify('info', msg);
			},
			warning: function(productionMsg, developmentMsg) {
				const msg = ((SGNUIKitConfig.environment === ENVIRONMENT_DEVELOPMENT || productionMsg === undefined) && developmentMsg !== undefined) ? developmentMsg : productionMsg;
				izitoast_notify('warning', msg);
			},
			error: function(productionMsg, developmentMsg) {
				const msg = ((SGNUIKitConfig.environment === ENVIRONMENT_DEVELOPMENT || productionMsg === undefined) && developmentMsg !== undefined) ? developmentMsg : productionMsg;
				izitoast_notify('error', msg);
			},
			question: function(productionMsg, developmentMsg) {
				const msg = ((SGNUIKitConfig.environment === ENVIRONMENT_DEVELOPMENT || productionMsg === undefined) && developmentMsg !== undefined) ? developmentMsg : productionMsg;
				izitoast_notify('question', msg);
			},
		}
	});
	//$.alert.success('test msg');

	function izitoast_notify(type, msg, title) {
		switch(type) {
			case 'success':
				title = (title === undefined || title === 'undefined') ? 'Success' : title;
				iziToast.success({
					title: title,
					message: msg,
					progressBarColor: '#4da422',
					iconColor: '#4da422'
				});
				break;
			case 'info':
				title = (title === undefined || title === 'undefined') ? 'Info' : title;
				iziToast.info({
					title: title,
					message: msg,
					progressBarColor: '#00b8d8',
					iconColor: '#00b8d8'
				});
				break;
			case 'warning':
				title = (title === undefined || title === 'undefined') ? 'Warning' : title;
				iziToast.warning({
					title: title,
					message: msg,
					progressBarColor: '#ffb400',
					iconColor: '#ffb400'
				});
				break;
			case 'error':
				title = (title === undefined || title === 'undefined') ? 'Error' : title;
				iziToast.error({
					title: title,
					message: msg,
					progressBarColor: '#ff2822',
					iconColor: '#ff2822'
				});
				break;
			case 'question':
				title = (title === undefined || title === 'undefined') ? 'Question' : title;
				iziToast.question({
					title: title,
					message: msg,
				});
				break;
		}
	}

	function izitoast_setup() {
		iziToast.settings({
			timeout: 5000,
			resetOnHover: true,
			transitionIn: 'flipInX',
			transitionOut: 'flipOutX',
			closeOnClick: true
		});
	}
	function izitoast() {
		iziToast.show({
			id: null,
			class: '', // The class that will be applied to the toast. It may be used as a reference.
			title: '', // Title of the toast.
			titleColor: '', // Title color.
			titleSize: '', // Title fontSize.
			titleLineHeight: '', // Title lineHeight.
			message: '', // Message of notification.
			messageColor: '', // Message color.
			messageSize: '', // Message fontSize.
			messageLineHeight: '', // Message lineHeight.
			backgroundColor: '', // Background color of the Toast
			theme: 'light', // It can be light or dark or set another class. Create and use like this ".iziToast-theme-name"
			color: '', // It can be #hexadecimal, pre-defined themes like blue, red, green and yellow or set another class. Create and use like this ".iziToast-color-name"
			icon: '', // Icon class (font-icon of your choice, Icomoon, Fontawesome etc.).
			iconText: '', // Icon text (font-icon using text, Material Icons, etc.).
			iconColor: '', // Icon color.
			iconUrl: null, // Address of file to be loaded.
			image: '', // Cover image.
			imageWidth: 50, // Width of cover image. Example 100px
			maxWidth: null, // Set maxWidth of toast. Example 500px
			zindex: null, // The z-index CSS attribute of the toast
			layout: 1, // It can be 1 (small) or 2 (medium), or use another layout, creating the class like this: ".iziToast-layout3"
			balloon: false, // Applies a balloon like toast.
			close: true, // Show "x" close button
			closeOnEscape: false, // Allows to close toast using the Esc key.
			closeOnClick: false, // Allows to close toast clicking on it.
			displayMode: 0, // - Waits until the toast is closed so you can open it (Use 1 or 'once'). - Replaces the toast that was already open (Use 2 or 'replace').
			position: 'topRight', // Where it will be shown. It can be bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter or center.
			target: '', // Fixed place where you want to show the toasts.
			targetFirst: true, //Add toast to first position.
			timeout: 5000, // Amount in milliseconds to close the toast or false to disable.
			rtl: false, // RTL option
			animateInside: true, // Enable animations of elements in the toast. It can be true or false.
			drag: true, // Drag Feature. Is used to close the toast.
			pauseOnHover: true, // Pause the toast timeout while the cursor is on it.
			resetOnHover: false, // Reset the toast timeout while the cursor is on it.
			progressBar: true, // Enable timeout progress bar.
			progressBarColor: '', // Progress bar color.
			progressBarEasing: 'linear', // Animation Easing of progress bar.
			overlay: false, // Enables display the Overlay layer on the page.
			overlayClose: false, // Allows to close toast clicking on the Overlay.
			overlayColor: 'rgba(0, 0, 0, 0.6)', // Overlay background color.
			transitionIn: 'fadeInUp', // Default toast open animation. It can be: bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
			transitionOut: 'fadeOut', // Default toast close animation. It can be: fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
			transitionInMobile: 'fadeInUp', // Default toast opening mobile transition.
			transitionOutMobile: 'fadeOutDown', // Default toast closing mobile transition.
			buttons: {}, // You can specify an array of buttons.
			inputs: {}, // You can specify an array of inputs.
			onOpening: function() {}, // Callback function triggered when opening the toast.
			onOpened: function() {}, // Callback function triggered when onOpened the toast.
			onClosing: function() {}, // Callback function triggered when closing the toast.
			onClosed: function() {} // Callback function triggered when closed the toast.
		});
	}
});
