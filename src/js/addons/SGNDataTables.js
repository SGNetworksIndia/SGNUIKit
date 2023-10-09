/*
 * Copyright (c) 2022-2023 SGNetworks. All rights reserved.
 *
 * The software is an exclusive copyright of "SGNetworks" and is provided as is exclusively with only "USAGE" access. "Modification",  "Alteration", "Re-distribution" is completely prohibited.
 * VIOLATING THE ABOVE TERMS IS A PUNISHABLE OFFENSE WHICH MAY LEAD TO LEGAL CONSEQUENCES.
 */

"use strict"; // Start of use strict
if(typeof jQuery === "undefined") {
	throw new Error("SGNDataTable requires jQuery");
}

;(function(window, document, $) {
	"use strict";

	/**
	 * @typedef {Object} SGNDataTableOptions The options for <b>SGNDataTable</b>
	 *
	 * @property {boolean} [sortable=true] State whether to make the rows of the <b>SGNDataTable</b> sortable.
	 * @property {number} [sorted_column=1] Specify the number of the column of which to sort the rows to be based on by default.<br/><b>NOTE:</b> This needs the <b><i>sortable</i></b> to be <b>TRUE</b>.
	 * @property {'asc'|'desc'} [order='asc'] Specify the sorting order of the rows.<br/><b><i>ASC —</i></b> Sort the rows in ascending order.<br/><b><i>DESC —</i></b>  Sort the rows in descending order.
	 * @property {boolean} [searchable=true] State whether to turn on search system.<br/><b>NOTE:</b> If <b><i>pagination</i></b> is enabled and <b><i>max_paging</i></b> is greater than 0('zero'), the search will be performed within the current page only.
	 * @property {[]} [skip_search=null] Specify the number of <i>columns</i> (starting from 0('zero') which denotes to the first column(<b>&lt;TD&gt;</b> element) to exclude from the search result.
	 * @property {boolean} [pagination=true] State whether to use pagination. If <b>FALSE</b>, all the rows will be displayed at once which may impact the site performance.
	 * @property {number} [max_paging=10] Specify the maximum number of rows in one page.
	 */

	/**
	 *
	 * @param {jQuery} $table The <b>DOM Element</b> wrapped with <b>jQuery</b> where the <b>SGNDataTable</b> will be initialized.
	 * @param {SGNDataTableOptions} [options={}] A JSON object specifying the options to override default settings.
	 *
	 * @return {SGNTabLayout} An instance of <b>SGNDataTable</b> if initialized.
	 *
	 * @constructor
	 */
	const SGNDataTable = function($table, options = {}) {
		const plugin = this;
		const $_this = $table;
		const $thead = $_this.children('thead'),
		      $tbody = $_this.children('tbody');
		let columnCount = 0,
		    rowCount    = 0,
		    $wrapper;
		const settings = {
			sortable: true,
			sorted_column: 1,
			order: 'asc',
			searchable: true,
			skip_search: [],
			pagination: true,
			max_paging: 10
		};

		function GUID(uppercase = true, hyphen = true) {
			let result, i, j;
			result = '';
			for(j = 0; j < 32; j++) {
				if(hyphen && (j === 8 || j === 12 || j === 16 || j === 20))
					result = result + '-';
				i = Math.floor(Math.random() * 16).toString(16);
				i = (uppercase) ? i.toUpperCase() : i.toLowerCase();
				result = result + i;
			}
			return result;
		}

		const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? $(a) : $(b), idx), getCellValue(asc ? $(b) : $(a), idx));

		function getCellValue(row, index) {
			return $(row).children("td").eq(index).text();
		}

		// removes highlighting by replacing each em tag within the specified elements with its content
		function removeHighlighting(highlightedElements) {
			highlightedElements.each(function() {
				const element = $(this);
				element.replaceWith(element.html());
			})
		}

		// add highlighting by wrapping the matched text into an em tag, replacing the current elements, html value with it
		function addHighlighting(element, textToHighlight) {
			const text = element.text(),
			      html = element.html();
			element.html(html.replace(/<span class="highlight">(.*)<\/span>/, ''));
			const highlightedText = '<span class="highlight">' + textToHighlight + '</span>',
			      newText         = text.replace(textToHighlight, highlightedText);

			element.contents().filter(function() { return this.nodeType === Node.TEXT_NODE; }).first().replaceWith(newText);
			//element.html(newText);
		}

		function init() {
			// do the work...
			columnCount = $thead.children('tr').children('th').length;
			rowCount = $tbody.find('tr').length;

			$.extend(settings, options);

			let $container = $_this.parents('.sgn-table-wrapper');
			if($container.length <= 0) {
				$table.wrap(`<div class="sgn-table-wrapper"/>`);
				$container = $table.parent('.sgn-table-wrapper');
			}
			$container.wrap(`<div class="sgn-datatable"/>`);
			$wrapper = $container.parent('.sgn-datatable');

			const order   = (!(settings.order === 'desc' || settings.order === false)),
				  sortCol = (typeof settings.sorted_column === 'number' && settings.sorted_column > 0 && settings.sorted_column <= columnCount && (settings.sorted_column - 1) >= 0) ? (settings.sorted_column - 1) : 0;

			if(settings.sortable || $_this.hasClass('sortable')) {
				initSortable(order);
				setSort(sortCol);
			}
			if(settings.searchable || $_this.hasClass('searchable')) {
				initSearch();
			}
			if((settings.pagination || $_this.hasClass('pagination')) && settings.max_paging > 0 && rowCount > settings.max_paging) {
				initPagination(settings.max_paging);
				initPagingSize(settings.max_paging);
			}
		}

		const initSortable = (order) => {
			let asc = order;
			const $ths = $thead.children('tr').children('th');

			$ths.filter(':not(.no-sort)').each((i, th) => $(th).on('click', ((elem) => {
				const $this = $(elem.target);
				const $tbody = $table.children('tbody'),
				      $rows  = $tbody.find('tr').get();

				if($ths.filter('.sort-asc').length > 0 || $ths.filter('.sort-desc').length > 0) {
					Array.from($rows)
					     .sort(comparer(Array.from($this.parent().children()).indexOf($this[0]), (asc = this.asc = !this.asc)))
					     .forEach($tr => $tbody.append($tr));
				} else {
					Array.from($rows)
					     .sort(comparer(Array.from($this.parent().children()).indexOf($this[0]), (asc = this.asc = order)))
					     .forEach($tr => $tbody.append($tr));
				}

				$ths.removeClass('sort-asc sort-desc');
				if(!asc)
					$this.addClass('sort-desc');
				else
					$this.addClass('sort-asc');
			})));

			if(!$_this.hasClass('sortable'))
				$_this.addClass('sortable');
		}

		const initSearch = () => {
			const $header = addHeader();
			const guid = GUID();
			const searchID = `sgn-datatable-search-${guid}`;
			let searchHTML = `<input type="text" id="${searchID}" class="form-control sgn-datatable-search-input" sgn-input-label="Search" placeholder="Search here...">`;
			if($header.find('.sgn-datatable-search-input').length < 1)
				$header.append(searchHTML).addClass('has-searchable');

			$(`#${searchID}`).on("keyup", function() {
				const value = $(this).val(),
					  v     = value.toLowerCase();
				const tdCount = $tbody.find("tr").find('td').length;
				const noContent = `<tr class="sgn-datatable-no-content"><td class="text-center" colspan="${tdCount}">Your query - <b>${value}</b> - did not return any results.</td></tr>`;

				let $noContent = $tbody.find('tr.sgn-datatable-no-content');
				// remove all highlighted text passing all em tags
				removeHighlighting($tbody.find("tr .highlight"));

				$tbody.find("tr").filter(function() {
					const $tr = $(this);
					let txt = $tr.text();
					if(settings.skip_search.length > 0) {
						settings.skip_search.forEach((val) => {
							const t = $($tr.find('td')[(val - 1)]).text();
							txt = txt.replace(t, '');
						});
					}
					const matchedIndex = txt.toLowerCase().indexOf(v);

					if(matchedIndex > -1) {
						if($noContent.length > 0)
							$noContent.remove();

						$tr.find('td').each(function(i) {
							if(!settings.skip_search.includes((i + 1))) {
								const $td = $(this);
								const txt = $td.text();
								const matches = txt.match(new RegExp(v, 'i'));
								if(matches !== null && matches.length > 0) {
									const match = matches[0];
									addHighlighting($td, match);
								}
							}
						});
						$tr.toggle(matchedIndex > -1);
					} else {
						$tr.toggle(false);

						if($noContent.length <= 0) {
							$tbody.append(noContent);
							$noContent = $tbody.find('tr.sgn-datatable-no-content');
						}
					}
				});
			});
		}

		const initPagination = (maxPaging = 10, reInit = false) => {
			const $footer = addFooter();
			const $trs = $tbody.find('tr');
			let $pagination = $footer.find('.pagination');

			if($pagination.length <= 0) {
				$footer.append('<div class="pagination"/>');
				$pagination = $footer.find('.pagination');
			}

			const rowsShown = maxPaging,
			      rowsTotal = $tbody.find('tr').length,
				  numPages  = rowsTotal / rowsShown;

			if(reInit)
				$pagination.html('');

			$pagination.append(`<a href="#" rel="prev">❮</a>`);
			for(let i = 0; i < numPages; i++) {
				const pageNum = (i + 1);
				$pagination.append(`<a href="#" rel="${pageNum}">${pageNum}</a>`);
			}
			$pagination.append(`<a href="#" rel="next">❯</a>`);

			$trs.hide();
			$trs.slice(0, rowsShown).show();

			const $pages = $pagination.children('a');
			const totalPages = ($pages.length - 2);
			$pagination.children('a:first').addClass('disabled');
			$pagination.children('a:nth-child(2)').addClass('active');
			if(totalPages <= 1)
				$pagination.children('a:last').addClass('disabled');

			$pages.on('click', function() {
				const $this     = $(this),
					  rel       = $this.attr('rel'),
					  $currPage = $pagination.children('a.active'),
					  curPage   = (parseInt($currPage.attr('rel')));

				if(rel !== 'next' && rel !== 'prev') {
					const page      = parseInt(rel),
						  startItem = page * rowsShown,
						  endItem   = startItem + rowsShown;

					$pages.removeClass('active disabled');
					$this.addClass('active');

					$trs.css('opacity', '0.0').hide().slice(startItem, endItem).css('display', 'table-row').animate({opacity: 1}, 300);

					if(page >= totalPages)
						$pages.filter(`[rel="next"]`).addClass('disabled');
					else
						$pages.filter(`[rel="next"]`).removeClass('disabled');

					if(page <= 1)
						$pages.filter(`[rel="prev"]`).addClass('disabled');
					else
						$pages.filter(`[rel="prev"]`).removeClass('disabled');
				} else {
					if(rel === 'next') {
						const page      = (curPage + 1),
							  startItem = (page - 1) * rowsShown,
							  endItem   = startItem + rowsShown;

						if(curPage < totalPages) {
							$pages.removeClass('active disabled');
							$pages.filter(`[rel="${page}"]`).addClass('active');

							$trs.css('opacity', '0.0').hide().slice(startItem, endItem).css('display', 'table-row').animate({opacity: 1}, 300);

							if(page >= totalPages)
								$this.addClass('disabled');
						}
					} else if(rel === 'prev') {
						const page      = (curPage - 1),
							  startItem = (page - 1) * rowsShown,
							  endItem   = startItem + rowsShown;

						if(curPage > 1) {
							$pages.removeClass('active disabled');
							$pages.filter(`[rel="${page}"]`).addClass('active');

							$trs.css('opacity', '0.0').hide().slice(startItem, endItem).css('display', 'table-row').animate({opacity: 1}, 300);

							if(page <= 1)
								$this.addClass('disabled');
						}
					}
				}
			});
		}

		const initPagingSize = (maxPaging = 10) => {
			const $header = addHeader(),
				  $footer = addFooter();
			const guid       = GUID(),
				  maxPagerID = `sgn-datatable-maxPager-${guid}`;

			let $pagination = $footer.find('.pagination');
			const $pages = $pagination.children('a');
			const totalPages = ($pages.length - 2);
			const rowsTotal = $tbody.find('tr').length;

			let maxPagingHTML = `<select id="${maxPagerID}" class="form-control sgn-datatable-maxPager-input" sgn-input-label="Paging Size">`;
			if(totalPages > maxPaging) {
				let remainder = (rowsTotal % maxPaging),
					max       = (remainder === 0) ? rowsTotal : (rowsTotal + remainder);

				for(let i = maxPaging; i <= max; i += maxPaging) {
					maxPagingHTML += `<option value="${i}">${i}</option>`;
				}
			}
			maxPagingHTML += `</select>`;

			if($header.find('.sgn-datatable-maxPager-input').length < 1)
				$header.prepend(maxPagingHTML).addClass('has-paging-size');

			let $pagingSize = $header.find('.sgn-datatable-maxPager-input');

			$pagingSize.on('change', function(e) {
				e.preventDefault();
				// noinspection JSCheckFunctionSignatures
				const $this = $(this),
				      v     = parseInt($this.find('option:selected').val());

				initPagination(v, true);
			});
		}

		const addHeader = () => {
			let actionsWrapper = `<div class="sgn-datatable-header"/>`;
			if($wrapper.children('.sgn-datatable-header').length <= 0)
				$wrapper.prepend(actionsWrapper);

			return $wrapper.children('.sgn-datatable-header');
		}

		const addFooter = () => {
			let actionsWrapper = `<div class="sgn-datatable-footer"/>`;
			if($wrapper.children('.sgn-datatable-footer').length <= 0)
				$wrapper.append(actionsWrapper);

			return $wrapper.children('.sgn-datatable-footer');
		}

		const setSort = (column) => {
			$thead.children('tr').children('th')[column].click();
		}

		init();

		return plugin;
	}

	/**
	 * Initializes a DataTable on the HTML Table with the supplied option
	 *
	 * @param {SGNDataTableOptions}[options={}] A JSON object specifying the options to override default settings.
	 *
	 * @return {jQuery} The jQuery object
	 */
	$.fn.SGNDataTable = function(options) {
		const _this  = this,
			  $_this = $(_this);

		return $_this.each(function() {
			const $this = $(this),
			      data  = $this.data("SGNDataTable");

			const plugin = (data === undefined) ? new SGNDataTable($this, options) : data;

			$this.data("SGNDataTable", plugin);
			$this[0]["SGNDataTable"] = plugin;
		});
	};

	SUKR(() => {
		const $datatables = $('.datatable');

		$datatables.SGNDataTable({
			sortable: true,
			sorted_column: 2,
			order: 'asc',
			searchable: true,
			skip_search: [5],
			pagination: true,
			max_paging: 20
		});
	});
})(window, document, jQuery);
