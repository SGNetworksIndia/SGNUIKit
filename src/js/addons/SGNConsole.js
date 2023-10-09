/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

// noinspection JSUnusedGlobalSymbols
class SGNConsole {
	/**
	 * @type {global|Window|WorkerGlobalScope}
	 */
	#root;
	/**
	 * @type {console|Console}
	 */
	#xConsole;
	#colours;
	#hideSrc;
	#useBGColor = false;
	#showIcon = false;
	#icons;
	#useDefault = false;

	/**
	 * Create an instance of SGNConsole
	 *
	 * @param {boolean} [hideSrc=true] Specify <b>FALSE</b> to reveal the source.
	 * @param {boolean} [useBGColor=false] Specify <b>TRUE</b> to print to stdout with background colour.
	 * @param {boolean} [showIcon=true] Specify <b>FALSE</b> to hide contextual icon.
	 *
	 * @constructor
	 *
	 * @return {SGNConsole} An instance of SGNConsole.
	 */
	constructor(hideSrc = true, useBGColor = false, showIcon = true) {
		this.isWindow = (typeof window !== 'undefined');
		//this.#root = (typeof global !== 'undefined') ? global : window || self;
		this.#xConsole = this.default = console;
		const cjsColours = {
			reset: "\x1b[0m",
			bright: "\x1b[1m",
			dim: "\x1b[2m",
			underscore: "\x1b[4m",
			blink: "\x1b[5m",
			reverse: "\x1b[7m",
			hidden: "\x1b[8m",

			fg: {
				black: "\x1b[30m",
				red: "\x1b[31m",
				green: "\x1b[32m",
				yellow: "\x1b[33m",
				blue: "\x1b[34m",
				magenta: "\x1b[35m",
				cyan: "\x1b[36m",
				white: "\x1b[37m",
				gray: "\x1b[90m",
				crimson: "\x1b[38m", // Scarlet
				log: "\x1b[37m",
				debug: "\x1b[38m",
				info: "\x1b[34m",
				success: "\x1b[32m",
				warning: "\x1b[33m",
				error: "\x1b[31m",
			},
			bg: {
				black: "\x1b[40m",
				red: "\x1b[41m",
				green: "\x1b[42m",
				yellow: "\x1b[43m",
				blue: "\x1b[44m",
				magenta: "\x1b[45m",
				cyan: "\x1b[46m",
				white: "\x1b[47m",
				gray: "\x1b[100m",
				crimson: "\x1b[48m",
				log: "\x1b[37m",
				debug: "\x1b[38m",
				info: "\x1b[34m",
				success: "\x1b[32m",
				warning: "\x1b[33m",
				error: "\x1b[31m",
			}
		};
		const esColours = {
			reset: "",
			fg: {
				black: "color: #000",
				red: "color: #f00",
				green: "color: #080",
				yellow: "color: #ff0",
				blue: "color: #00f",
				magenta: "color: #f0f",
				cyan: "color: #0ff",
				white: "color: #fff",
				gray: "color: #888",
				log: "color: #000",
				debug: "color: #888",
				info: "color: #059",
				success: "color: #270",
				warning: "color: #9f6000",
				error: "color: #d8000c",
			},
			bg: {
				black: "background-color: #000",
				red: "background-color: #000",
				green: "background-color: #000",
				yellow: "background-color: #000",
				blue: "background-color: #000",
				magenta: "background-color: #000",
				cyan: "background-color: #000",
				white: "background-color: #000",
				gray: "background-color: #000",
				crimson: "background-color: #000", // Scarlet
				log: "background-color: #ffffffff",
				debug: "background-color: #ffffffff",
				info: "background-color: #bef",
				success: "background-color: #dff2bf",
				warning: "background-color: #feefb3",
				error: "background-color: #ffbaba",
			}
		}
		this.#colours = (this.isWindow) ? esColours : cjsColours;
		this.#icons = {
			log:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjODg4Ij48cGF0aCBkPSJNMjU2IDBDMTE0LjYgMCAwIDExNC42IDAgMjU2czExNC42IDI1NiAyNTYgMjU2czI1Ni0xMTQuNiAyNTYtMjU2UzM5Ny40IDAgMjU2IDB6TTIzMiAxNTJDMjMyIDEzOC44IDI0Mi44IDEyOCAyNTYgMTI4czI0IDEwLjc1IDI0IDI0djEyOGMwIDEzLjI1LTEwLjc1IDI0LTI0IDI0UzIzMiAyOTMuMyAyMzIgMjgwVjE1MnpNMjU2IDQwMGMtMTcuMzYgMC0zMS40NC0xNC4wOC0zMS40NC0zMS40NGMwLTE3LjM2IDE0LjA3LTMxLjQ0IDMxLjQ0LTMxLjQ0czMxLjQ0IDE0LjA4IDMxLjQ0IDMxLjQ0QzI4Ny40IDM4NS45IDI3My40IDQwMCAyNTYgNDAweiIvPjwvc3ZnPg==',
			debug:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjODg4Ij48cGF0aCBkPSJNMjU2IDBDMTE0LjYgMCAwIDExNC42IDAgMjU2czExNC42IDI1NiAyNTYgMjU2czI1Ni0xMTQuNiAyNTYtMjU2UzM5Ny40IDAgMjU2IDB6TTIzMiAxNTJDMjMyIDEzOC44IDI0Mi44IDEyOCAyNTYgMTI4czI0IDEwLjc1IDI0IDI0djEyOGMwIDEzLjI1LTEwLjc1IDI0LTI0IDI0UzIzMiAyOTMuMyAyMzIgMjgwVjE1MnpNMjU2IDQwMGMtMTcuMzYgMC0zMS40NC0xNC4wOC0zMS40NC0zMS40NGMwLTE3LjM2IDE0LjA3LTMxLjQ0IDMxLjQ0LTMxLjQ0czMxLjQ0IDE0LjA4IDMxLjQ0IDMxLjQ0QzI4Ny40IDM4NS45IDI3My40IDQwMCAyNTYgNDAweiIvPjwvc3ZnPg==',
			info:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjMDU5Ij48cGF0aCBkPSJNMjU2IDBDMTE0LjYgMCAwIDExNC42IDAgMjU2czExNC42IDI1NiAyNTYgMjU2czI1Ni0xMTQuNiAyNTYtMjU2UzM5Ny40IDAgMjU2IDB6TTI1NiAxMjhjMTcuNjcgMCAzMiAxNC4zMyAzMiAzMmMwIDE3LjY3LTE0LjMzIDMyLTMyIDMyUzIyNCAxNzcuNyAyMjQgMTYwQzIyNCAxNDIuMyAyMzguMyAxMjggMjU2IDEyOHpNMjk2IDM4NGgtODBDMjAyLjggMzg0IDE5MiAzNzMuMyAxOTIgMzYwczEwLjc1LTI0IDI0LTI0aDE2di02NEgyMjRjLTEzLjI1IDAtMjQtMTAuNzUtMjQtMjRTMjEwLjggMjI0IDIyNCAyMjRoMzJjMTMuMjUgMCAyNCAxMC43NSAyNCAyNHY4OGgxNmMxMy4yNSAwIDI0IDEwLjc1IDI0IDI0UzMwOS4zIDM4NCAyOTYgMzg0eiIvPjwvc3ZnPg==',
			success:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjMjcwIj48cGF0aCBkPSJNMCAyNTZDMCAxMTQuNiAxMTQuNiAwIDI1NiAwQzM5Ny40IDAgNTEyIDExNC42IDUxMiAyNTZDNTEyIDM5Ny40IDM5Ny40IDUxMiAyNTYgNTEyQzExNC42IDUxMiAwIDM5Ny40IDAgMjU2ek0zNzEuOCAyMTEuOEMzODIuNyAyMDAuOSAzODIuNyAxODMuMSAzNzEuOCAxNzIuMkMzNjAuOSAxNjEuMyAzNDMuMSAxNjEuMyAzMzIuMiAxNzIuMkwyMjQgMjgwLjRMMTc5LjggMjM2LjJDMTY4LjkgMjI1LjMgMTUxLjEgMjI1LjMgMTQwLjIgMjM2LjJDMTI5LjMgMjQ3LjEgMTI5LjMgMjY0LjkgMTQwLjIgMjc1LjhMMjA0LjIgMzM5LjhDMjE1LjEgMzUwLjcgMjMyLjkgMzUwLjcgMjQzLjggMzM5LjhMMzcxLjggMjExLjh6Ii8+PC9zdmc+',
			warning:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjOWY2MDAwIj48cGF0aCBkPSJNNTA2LjMgNDE3bC0yMTMuMy0zNjRjLTE2LjMzLTI4LTU3LjU0LTI4LTczLjk4IDBsLTIxMy4yIDM2NEMtMTAuNTkgNDQ0LjkgOS44NDkgNDgwIDQyLjc0IDQ4MGg0MjYuNkM1MDIuMSA0ODAgNTIyLjYgNDQ1IDUwNi4zIDQxN3pNMjMyIDE2OGMwLTEzLjI1IDEwLjc1LTI0IDI0LTI0UzI4MCAxNTQuOCAyODAgMTY4djEyOGMwIDEzLjI1LTEwLjc1IDI0LTIzLjEgMjRTMjMyIDMwOS4zIDIzMiAyOTZWMTY4ek0yNTYgNDE2Yy0xNy4zNiAwLTMxLjQ0LTE0LjA4LTMxLjQ0LTMxLjQ0YzAtMTcuMzYgMTQuMDctMzEuNDQgMzEuNDQtMzEuNDRzMzEuNDQgMTQuMDggMzEuNDQgMzEuNDRDMjg3LjQgNDAxLjkgMjczLjQgNDE2IDI1NiA0MTZ6Ii8+PC9zdmc+',
			error:
				'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZDgwMDBjIj48cGF0aCBkPSJNMCAyNTZDMCAxMTQuNiAxMTQuNiAwIDI1NiAwQzM5Ny40IDAgNTEyIDExNC42IDUxMiAyNTZDNTEyIDM5Ny40IDM5Ny40IDUxMiAyNTYgNTEyQzExNC42IDUxMiAwIDM5Ny40IDAgMjU2ek0xNzUgMjA4LjFMMjIyLjEgMjU1LjFMMTc1IDMwM0MxNjUuNyAzMTIuNCAxNjUuNyAzMjcuNiAxNzUgMzM2LjFDMTg0LjQgMzQ2LjMgMTk5LjYgMzQ2LjMgMjA4LjEgMzM2LjFMMjU1LjEgMjg5LjlMMzAzIDMzNi4xQzMxMi40IDM0Ni4zIDMyNy42IDM0Ni4zIDMzNi4xIDMzNi4xQzM0Ni4zIDMyNy42IDM0Ni4zIDMxMi40IDMzNi4xIDMwM0wyODkuOSAyNTUuMUwzMzYuMSAyMDguMUMzNDYuMyAxOTkuNiAzNDYuMyAxODQuNCAzMzYuMSAxNzVDMzI3LjYgMTY1LjcgMzEyLjQgMTY1LjcgMzAzIDE3NUwyNTUuMSAyMjIuMUwyMDguMSAxNzVDMTk5LjYgMTY1LjcgMTg0LjQgMTY1LjcgMTc1IDE3NUMxNjUuNyAxODQuNCAxNjUuNyAxOTkuNiAxNzUgMjA4LjFWMjA4LjF6Ii8+PC9zdmc+',
		}
		this.#hideSrc = (hideSrc === undefined) ? true : hideSrc;
		this.#useBGColor = useBGColor;
		this.#showIcon = showIcon;
		//this.clear();
	}

	/***
	 *
	 * @param {"log"|"debug"|"info"|"warn"|"error"|"success"} type
	 * @param {any} message
	 * @param {...} args
	 */
	#apply(type = 'log', message, args) {
		//region Variables
		const fgColors = this.#colours.fg,
		      bgColors = this.#colours.bg,
		      icons    = this.#icons;
		const handler = (type === 'log') ? this.#xConsole.log :
		                (type === 'debug') ? this.#xConsole.debug :
		                (type === 'info') ? this.#xConsole.log :
		                (type === 'warn') ? this.#xConsole.log :
		                (type === 'error' && !this.#hideSrc) ? this.#xConsole.error : this.#xConsole.log;
		const fgColor = (type === 'log') ? this.#colours.reset :
		                (type === 'debug') ? fgColors.debug :
		                (type === 'info') ? fgColors.info :
		                (type === 'warn') ? fgColors.warning :
		                (type === 'error') ? fgColors.error :
		                (type === 'success') ? fgColors.success : fgColors.gray;
		const bgColor = (type === 'log') ? this.#colours.reset :
		                (type === 'debug') ? this.#colours.reset :
		                (type === 'info') ? bgColors.info :
		                (type === 'warn') ? bgColors.warning :
		                (type === 'error') ? bgColors.error :
		                (type === 'success') ? bgColors.success : bgColors.white;
		const icon = (type === 'log') ? icons.log :
		             (type === 'debug') ? icons.debug :
		             (type === 'info') ? icons.info :
		             (type === 'warn') ? icons.warning :
		             (type === 'error') ? icons.error :
		             (type === 'success') ? icons.success : icons.white;
		//endregion

		if(!this.#useDefault) {
			args = Array.from(args);
			const icn = `background-image: url(data:image/svg+xml;base64,${icon}); background-repeat: no-repeat;  background-position: 10px 5px; background-size: 20px; padding-left: 40px`;
			const style = `margin: 0; padding: 5px; line-height: 20px; font-size: 15px; border-radius: 5px; display: block;`;
			const styles = (this.#useBGColor) ? `${fgColor}; ${bgColor}; ${style}` : `${fgColor}; ${style}`;

			if(typeof message !== 'string' && typeof message !== 'number') {
				args.push(message);
				message = '';
			}
			if(this.isWindow) {
				if(this.#showIcon)
					args.unshift(`%c${message}`, styles + icn);
				else
					args.unshift(`%c${message}`, styles);
			} else {
				if(this.#useBGColor)
					args.unshift(bgColor, fgColor, message, this.#colours.reset);
				else
					args.unshift(fgColor, message, this.#colours.reset);
			}
			//this.#xConsole.log(args);
			if(this.#hideSrc && type !== 'debug') {
				setTimeout(handler.bind(this.#xConsole, ...args));
			} else
				handler.apply(this.#xConsole, args);
		} else {
			return this.#xConsole[type](args);
		}
	}

	/**
	 * Prints to `stdout` with newline. Multiple arguments can be passed, with the
	 * first used as the primary message and all additional used as substitution values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html) (the arguments are all passed to `global.console.log()`).
	 *
	 * ```js
	 * const count = 5;
	 * console.log('count: %d', count);
	 * // Prints: count: 5, to stdout
	 * console.log('count:', count);
	 * // Prints: count: 5, to stdout
	 * ```
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see Console.log
	 */
	log(message, ...args) {
		this.#apply('log', message, args);
	}

	/**
	 * Similar to <b>SGNConsole.log()</b> but it prints in <i>gray</i> color as well as it prints the <i>source</i> also.
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see log
	 */
	debug(message, ...args) {
		this.#apply('debug', message, args);
	}

	/**
	 * Similar to <b>SGNConsole.log()</b> but it prints in <i>blue</i> color.
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see log
	 */
	info(message, ...args) {
		this.#apply('info', message, args);
	}

	/**
	 * Similar to <b>SGNConsole.log()</b> but it prints in <i>yellow</i> color.
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see log
	 */
	warn(message, ...args) {
		this.#apply('warn', message, args);
	}

	/**
	 * Similar to <b>SGNConsole.log()</b> but it prints in <i>red</i> color.
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see log
	 */
	error(message, ...args) {
		this.#apply('error', message, args);
		//exit();
	}

	/**
	 * Similar to <b>SGNConsole.log()</b> but it prints in <i>green</i> color.
	 *
	 * @param {any} message The primary message to print.
	 * @param {...} args All the additional arguments.
	 *
	 * @version 1.2.2
	 * @see log
	 */
	success(message, ...args) {
		this.#apply('success', message, args);
	}

	/**
	 * Starts a timer that can be used to compute the duration of an operation. Timers
	 * are identified by a unique `label`. Use the same `label` when calling {@link timeEnd} to stop the timer and output the elapsed time in
	 * suitable time units to `stdout`. For example, if the elapsed
	 * time is 3869ms, `console.timeEnd()` displays "3.869s".
	 *
	 * @param {string} [label] A label to identify the timer
	 *
	 * @see Console.time
	 */
	time(label) {
		this.#xConsole.time(label);
	}

	/**
	 * Stops a timer that was previously started by calling {@link time} and
	 * prints the result to `stdout`:
	 *
	 * ```js
	 * console.time('100-elements');
	 * for (let i = 0; i < 100; i++) {}
	 * console.timeEnd('100-elements');
	 * // prints 100-elements: 225.438ms
	 * ```
	 *
	 * @param {string} [label] A label to identify the timer
	 *
	 * @see Console.timeEnd
	 */
	timeEnd(label) {
		this.#xConsole.timeEnd(label);
	}

	/**
	 * Increases indentation of subsequent lines by spaces for `groupIndentation`length.
	 *
	 * @param {...string} [label] If one or more `label`s are provided, those are printed first without the
	 * additional indentation.
	 *
	 * @see Console.group
	 */
	group(...label) {
		this.#xConsole.group(...label);
	}

	/**
	 * Decreases indentation of subsequent lines by spaces for `groupIndentation`length.
	 *
	 * @see Console.groupEnd
	 */
	groupEnd() {
		this.#xConsole.groupEnd();
	}

	/**
	 * Try to construct a table with the columns of the properties of `tabularData`(or use `properties`) and rows of `tabularData` and log it. Falls back to just
	 * logging the argument if it can’t be parsed as tabular.
	 *
	 * @example ```js
	 * // These can't be parsed as tabular data
	 * console.table(Symbol());
	 * // Symbol()
	 *
	 * console.table(undefined);
	 * // undefined
	 *
	 * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
	 * // ┌─────────┬─────┬─────┐
	 * // │ (index) │  a  │  b  │
	 * // ├─────────┼─────┼─────┤
	 * // │    0    │  1  │ 'Y' │
	 * // │    1    │ 'Z' │  2  │
	 * // └─────────┴─────┴─────┘
	 *
	 * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
	 * // ┌─────────┬─────┐
	 * // │ (index) │  a  │
	 * // ├─────────┼─────┤
	 * // │    0    │  1  │
	 * // │    1    │ 'Z' │
	 * // └─────────┴─────┘
	 * ```
	 *
	 * @param {{}[]} data An array of JSON object to create table from.
	 * @param {[]} [properties] Alternate properties for constructing the table.
	 *
	 * @see Console.table
	 */
	table(data, properties) {
		this.#xConsole.table(data, properties);
	}

	/**
	 * Uses `util.inspect()` on `obj` and prints the resulting string to `stdout`.
	 * This function bypasses any custom `inspect()` function defined on `obj`.
	 *
	 * @see Console.dir
	 */
	dir(obj, options) {
		this.#xConsole.dir(obj, options);
	}

	/**
	 * When `stdout` is a TTY, calling `console.clear()` will attempt to clear the
	 * TTY. When `stdout` is not a TTY, this method does nothing.
	 *
	 * The specific operation of `console.clear()` can vary across operating systems
	 * and terminal types. For most Linux operating systems, `console.clear()`operates similarly to the `clear` shell command. On Windows, `console.clear()`will clear only the output in the
	 * current terminal viewport for the Node.js binary.
	 *
	 * @see Console.clear
	 */
	clear() {
		this.#xConsole.clear();
	}

	/**
	 * `console.assert()` writes a message if `value` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or omitted. It only
	 * writes a message and does not otherwise affect execution. The output always
	 * starts with `"Assertion failed"`. If provided, `message` is formatted using `util.format()`.
	 *
	 * If `value` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), nothing happens.
	 *
	 * ```js
	 * console.assert(true, 'does nothing');
	 *
	 * console.assert(false, 'Whoops %s work', 'didn\'t');
	 * // Assertion failed: Whoops didn't work
	 *
	 * console.assert();
	 * // Assertion failed
	 * ```
	 * @since v0.1.101
	 * @param {any} value The value tested for being truthy.
	 * @param {string} [message] All arguments besides `value` are used as error message.
	 * @param {...} [optionalParams]
	 *
	 * @see Console.assert
	 */
	assert(value, message, ...optionalParams) {
		this.#xConsole.assert(value, message, ...optionalParams);
	}

	/**
	 * Prints to `stderr` the string `'Trace: '`, followed by the `util.format()` formatted message and stack trace to the current position in the code.
	 *
	 * ```js
	 * console.trace('Show me');
	 * // Prints: (stack trace will vary based on where trace is called)
	 * //  Trace: Show me
	 * //    at repl:2:9
	 * //    at REPLServer.defaultEval (repl.js:248:27)
	 * //    at bound (domain.js:287:14)
	 * //    at REPLServer.runBound [as eval] (domain.js:300:12)
	 * //    at REPLServer.<anonymous> (repl.js:412:12)
	 * //    at emitOne (events.js:82:20)
	 * //    at REPLServer.emit (events.js:169:7)
	 * //    at REPLServer.Interface._onLine (readline.js:210:10)
	 * //    at REPLServer.Interface._line (readline.js:549:8)
	 * //    at REPLServer.Interface._ttyWrite (readline.js:826:14)
	 * ```
	 * @see Console.trace
	 */
	trace(message, ...optionalParams) {
		this.#xConsole.trace(message, ...optionalParams);
	}

	/**
	 * Set whether to use the browser default console.
	 *
	 * @param {boolean} useDefault
	 *
	 * @return SGNConsole
	 */
	setUseDefaultConsole = useDefault => {
		this.#useDefault = (typeof useDefault === 'boolean') ? useDefault : this.#useDefault;

		return this;
	};

	/**
	 * Get the browser default console.
	 *
	 * @return {console|Console}
	 */
	getDefaultConsole = () => this.#xConsole;
}

const Console = new SGNConsole(true, true);
if(typeof root !== 'undefined') {
	root.SGNConsole = SGNConsole;

	/**
	 * Create an instance of SGNConsole
	 *
	 * @param {boolean} [hideSrc=true] Specify <b>FALSE</b> to reveal the source.
	 * @param {boolean} [useBGColor=false] Specify <b>TRUE</b> to print to stdout with background colour.
	 * @param {boolean} [showIcon=true] Specify <b>FALSE</b> to hide contextual icon.
	 *
	 * @return {SGNConsole} An instance of SGNConsole.
	 */
	root.getSGNConsole = (hideSrc = true, useBGColor = false, showIcon = true) => new SGNConsole(hideSrc, useBGColor, showIcon);
	root.console = Console;
}
