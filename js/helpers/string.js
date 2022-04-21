String.prototype.format = function() {
	let s = [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
	s = [...arguments].reduce((p, c) => p.replace(/%d/, c), s);
	s = [...arguments].reduce((p, c) => p.replace(/%f/, c), s);

	return s;
};
String.prototype.guid = function() {

};
