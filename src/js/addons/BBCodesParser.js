/*
 * Copyright (c) 2022 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

class BBCodesParser {
	_pluginName = "BBCodesParser";
	_version = '1.0.0';
	plugin = this;
	tags = {
		"decoded": {
			"search": [
				/\[b](.*?)\[\/b]/ig,
				/\[i](.*?)\[\/i]/ig,
				/\[u](.*?)\[\/u]/ig,
				/\[br](.*?)\[\/br]/ig,
				/\[br:](.*?)/ig,
				/\[li](.*?)\[\/li]/ig,
				/\[lib](.*?)\[\/lib]/ig,
				/\[lii](.*?)\[\/lii]/ig,
				/\[liu](.*?)\[\/liu]/ig,

				/\[b](.*?)\[:b]/ig,
				/\[i](.*?)\[:i]/ig,
				/\[u](.*?)\[:u]/ig,
				/\[br](.*?)\[:br]/ig,
				/\[li](.*?)\[:li]/ig,
				/\[lib](.*?)\[:lib]/ig,
				/\[lii](.*?)\[:lii]/ig,
				/\[liu](.*?)\[:liu]/ig,

				/\[uc](.*?)\[\/uc]/ig,
				/\[red](.*?)\[\/red]/ig,
				/\[indent](.*?)/ig,
				/\[AL=CAP]((.|\n)*?)\[\/AL]/ig,
				/\[AL=CAPB]((.|\n)*?)\[\/AL]/ig,
				/\[AL=CAPI]((.|\n)*?)\[\/AL]/ig,
				/\[AL=CAPU]((.|\n)*?)\[\/AL]/ig,
				/\[RNL=SM]((.|\n)*?)\[\/RNL]/ig,
				/\[RNL=SMB]((.|\n)*?)\[\/RNL]/ig,
				/\[RNL=SMI]((.|\n)*?)\[\/RNL]/ig,
				/\[RNL=SMU]((.|\n)*?)\[\/RNL]/ig,
			],
			"replace": [
				'<strong>$1</strong>',
				'<i>$1</i>',
				'<u>$1</u>',
				'<br>$1</br>',
				'<br/>$1',
				'<li>$1</li>',
				'<li class="bold">$1</li>',
				'<li class="italic">$1</li>',
				'<li class="underline">$1</li>',

				'<strong>$1</strong>',
				'<i>$1</i>',
				'<u>$1</u>',
				'<br>$1</br>',
				'<li>$1</li>',
				'<li class="bold">$1</li>',
				'<li class="italic">$1</li>',
				'<li class="underline">$1</li>',

				'<span style="text-transform: uppercase;">$1</span>',
				'<span style="color: #C00;">$1</span>',
				'<span class="indent">$1</span>',
				'<ol class="alcap">$1</ol>',
				'<ol class="alcap bold">$1</ol>',
				'<ol class="alcap italic">$1</ol>',
				'<ol class="alcap underline">$1</ol>',
				'<ol class="romsm">$1</ol>',
				'<ol class="romsm bold">$1</ol>',
				'<ol class="romsm italic">$1</ol>',
				'<ol class="romsm underline">$1</ol>',
			]
		},
		"encoded": {
			"search": [
				/<strong>(.*?)<\/strong>/ig,
				/<i>(.*?)<\/i>/ig,
				/<u>(.*?)<\/u>/ig,
				/<br>(.*?)<\/br>/ig,
				/<br>/ig,
				/<li>(.*?)<\/li>/ig,
				/<li class="bold">(.*?)<\/li>/ig,
				/<li class="italic">(.*?)<\/li>/ig,
				/<li class="underline">(.*?)<\/li>/ig,

				/<span style="text-transform: uppercase;">(.*?)<\/span>/ig,
				/<span style="color: #C00;">(.*?)<\/span>/ig,
				/<span class="indent">(.*?)<\/span>/ig,
				/<ol class="alcap">(.*?)<\/ol>/ig,
				/<ol class="alcap bold">(.*?)<\/ol>/ig,
				/<ol class="alcap italic">(.*?)<\/ol>/ig,
				/<ol class="alcap underline">(.*?)<\/ol>/ig,
				/<ol class="romsm">(.*?)<\/ol>/ig,
				/<ol class="romsm bold">(.*?)<\/ol>/ig,
				/<ol class="romsm italic">(.*?)<\/ol>/ig,
				/<ol class="romsm underline">(.*?)<\/ol>/ig,
			],
			"replace": [
				'[b]$1[/b]',
				'[i]$1[/i]',
				'[u]$1[/u]',
				'[br]$1[/br]',
				'[br:]',
				'[li]$1[/li]',
				'[lib]$1[/lib]',
				'[lii]$1[/lii]',
				'[liu]$1[/liu]',

				'[uc]$1[/uc]',
				'[red]$1[/red]',
				'[indent]',

				'[AL=CAP]$1[/AL]',
				'[AL=CAPB]$1[/AL]',
				'[AL=CAPI]$1[/AL]',
				'[AL=CAPU]$1[/AL]',

				'[RNL=SM]$1[/RNL]',
				'[RNL=SMB]$1[/RNL]',
				'[RNL=SMI]$1[/RNL]',
				'[RNL=SMU]$1[/RNL]',
			],
		}
	};
	data;
	encoded;
	decoded;
	$;
	defaults = {};


	constructor(bbcodes) {
		if(jQuery !== undefined) {
			this.$ = jQuery;
			if(bbcodes != null)
				this.data = (this.$.isJSON(bbcodes)) ? bbcodes : this.$.parseJSON(bbcodes);
			else
				this.data = this.defaults;
		} else
			throw new Error(`${this._pluginName} requires jQuery.`);
	}

	toBBCode(codes) {
		let str = codes;
		for(let i = 0; i < this.tags.encoded.search.length; i++) {
			str = str.replace(this.tags.encoded.search[i], this.tags.encoded.replace[i]);
		}
		return this.br2nl(str);
	}

	toHTML(codes) {
		let str = codes;
		for(let i = 0; i < this.tags.decoded.search.length; i++) {
			str = str.replace(this.tags.decoded.search[i], this.tags.decoded.replace[i]);
		}
		return this.nl2br(str);
	}

	nl2br(str) {
		return str.replace(/\n/g, "<br>");
	}

	br2nl(str) {
		return str.replace(/\[br:]/g, "\n");
	}
}