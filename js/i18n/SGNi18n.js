const SGNi18n = function(language, $element) {
	const _this = this,
		  regex = /{{(\w+)(\(((([\w\d]+), ?)*('.*?')*)\))?}}/gi;
	this.language = language;
	this.context = $element;

	this.refresh = () => {
		if(_this.context.length > 0)
			walkText(_this.context[0]);
	}

	this.setContext = ($element) => {
		this.context = $element;

		return _this;
	}

	this.setLanguage = (language) => {
		this.language = language;

		return _this;
	}

	this.getString = (key, ...args) => {
		if(this.language.hasOwnProperty(key)) {
			let value = (args !== undefined && args !== null) ? this.language[key].format(...args) : this.language[key];
			if(regex.test(value)) {
				const matches = getMatches(value, regex);

				if(matches !== null) {
					const match = matches[0][1];

					value = (match !== key) ? process(value) : value;
				}
			}
			return value;
		} else {
			return `${key}_not_defined`;
		}
	}
	function getMatches(string, regex, index) {
		//index || (index = 1); // default to the first capturing group
		const matches = [];
		let match;
		regex.lastIndex = 0;
		while (match = regex.exec(string)) {
			if(index)
				matches.push(match[index]);
			else
				matches.push(match);
		}
		return matches;
	}

	function process(str) {
		str = str.replace(regex, function(match, varname, p3, p4, p5, p6, p7) {
			if(varname !== str) {
				let args   = p4,
					params = p7;
				if(params !== undefined && params !== null) {
					params = params.replaceAll(',', '{%COMMA%}');
					args = args.replaceAll(p7, params);

					args = args.replaceAll(',', '{%SEMICOLON%}');
					args = args.replaceAll(/\s?{%SEMICOLON%}\s?/g, ';');
					args = args.replaceAll(/{%COMMA%}/g, ',');
				}

				if(args !== undefined && args !== null) {
					args = args.split(';');
					return _this.getString(varname, ...args);
				}
				return _this.getString(varname);
			}
		});

		return str;
	}

	function walkText(node) {
		if(node.nodeType === 3) {
			node.data = process(node.data);
		}
		if(node.nodeType === 1 && node.nodeName === 'INPUT') {
			node.placeholder = process(node.placeholder);
			node.value = process(node.value);
		}
		if(node.nodeType === 1 && node.nodeName !== "SCRIPT") {
			for(let i = 0; i < node.childNodes.length; i++) {
				walkText(node.childNodes[i]);
			}
		}
	}

	this.refresh();

	return this;
}
