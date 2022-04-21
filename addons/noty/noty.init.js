    function notify(type,msg,modal,time,pbar,layout,kill,theme,closewith,max) {
		if(type != null){
			var tp=type;
		} else {
			var tp='info';
		}
		if(modal != null){
			var m=modal;
		} else {
			var m=true;
		}
		if(time != null){
			var to=time*1000;
		} else {
			var to=5000;
		}
		if(pbar != null){
			var pb=pbar;
		} else {
			var pb=true;
		}
		if(layout != null){
			var l=layout;
		} else {
			var l='topRight';
		}
		if(kill != null){
			var k=kill;
		} else {
			var k=false;
		}
		if(theme != null){
			var t=theme;
		} else {
			var t='relax';
		}
		if(closewith != null){
			var cw="['"+closewith+"']";
		} else {
			var cw=['click', 'backdrop'];
		}
		if(max != null){
			var mv=max;
		} else {
			var mv=5;
		}
		new Noty({
			type		: tp,
			layout		: l,
			theme		: t,
			text		: msg,
			timeout     : to,
			progressBar : pb,
			closeWith	: cw,
			modal		: m,
			killer		: k,
			animation: {
				open: 'animated bounceInRight', // Animate.css class names
				close: 'animated bounceOutRight', // Animate.css class names
				easing: 'swing',
				speed: 500 // opening & closing animation speed
			}
		}).show();
	}

    function generateAll() {
        generate('alert');
        generate('information');
        generate('error');
        generate('warning');
        generate('notification');
        generate('success');
    }
$(document).on('click', '.noty_modal', function(){
	$('.noty_bar').click();
});
/*****OPTIONS:******/
/****TYPE: 'alert','information','error','warning','notification','success'
*****MSG: 'Your message'
*****LAYOUT: 'top'(BLOCK),'topLeft','topCenter','topRight', 'centerLeft','center','centerRight',bottom'(BLOCK),'bottomLeft','bottomCenter','bottomRight'
******MODAL: true,false
******maxVisible: Maximum visible items
******THEME: 'defaultTheme','relax','bootstrapTheme','metroui','semanticUI'
**********************/
	