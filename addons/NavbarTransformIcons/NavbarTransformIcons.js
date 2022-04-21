var anchor = document.querySelectorAll('.nav-transformBtn');
[].forEach.call(anchor, function(anchor){
	var open = (anchor.classList.contains('close'));
	anchor.onclick = function(event){
		//event.preventDefault();
		if(!open){
			this.classList.add('close');
			open = true;
		} else {
			this.classList.remove('close');
			open = false;
		}
	}
});