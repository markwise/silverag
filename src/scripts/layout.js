/* global
win,
doc,
supportsMediaQueries,
attr,
mediaMatch,
generateAgId,
keyStore,
styleSheet
*/

//
// @module
//
// Handles all operations related to an ag layout element
//

var layout = (function () {
	'use strict';
	
	//
	// @private
	//
	// Returns the largest offsetHeight value of all ag-cel elements to be used
	// as the min-height. As the method name implies, this is for IE8 only.
	//
	// @param {HTMLElement} ele
	//		An ag element
	//
	// @returns {Number}
	//		The min-height value
	//
	//
	
	var getContentMaxHeightIE8 = function (ele) {
		var eles = getVisibleElements(ele),
			i = eles.length,
			a = [];
	
		while (i--) {
			a.push(eles[i].offsetHeight);
		}
		
		return Math.max.apply(null, a);
	};
	
	
	//
	// @private
	//
	// Returns the height of an ag element that will be used as the min-height
	// value for all ag-cel and ag-line elements
	//
	// @param {HTMLElement} ele
	//		An ag element
	//
	// @returns {Number}
	//		The min-height value
	//

	var getMinHeight = function (ele) {
		var style = win.getComputedStyle,
			height;

		//DOM Level 2 accessor
		if (style) {
			height = style(ele, null).height;
	
		//IE8
		} else {
			height = ele.currentStyle.height;
		
			if (height === 'auto') {
				height = getContentMaxHeightIE8(ele) + 'px';
			}
		}
	
		return height;
	};

	
	//
	// @private
	//
	// Creates and returns an ag-line element
	//
	// @params {Number} index
	//		The index of the line in relation to other lines in a layout. This 
	//		index is used as a styling hook to show and hide ag-line elements.
	//
	// @returns {HTMLElement}
	//		An ag-line element
	//
	
	var createLine = function (index) {
		var fragment = doc.createDocumentFragment(),
			line = doc.createElement('div');
	
		attr('ag-line', line).set(index);
		//Safari requires a tab character
		fragment.appendChild(doc.createTextNode('\u0009'));
		fragment.appendChild(line);
		fragment.appendChild(doc.createTextNode('\u0009'));
	
		return fragment;
	};


	//
	// @private
	//
	// Returns all visible ag-cel elements unless they have the show modifier,
	// which are hidden by default when not responding.
	//
	// @param {HTMLElement} ele
	//		An ag element
	//
	// @returns {Array}
	//		A list of all visible ag-cel elements
	//

	var getVisibleElements = function (ele) {
		var node = ele.firstChild,
			a = [];

		while (node) {
			if (node.nodeType === 1) {
				if (!attr('ag-cel', node).has('show')) {
					a.push(node);
				}
			}
		
			node = node.nextSibling;
		}

		return a;
	};


	//
	// @private
	//
	// Respond gets called once during intialization to see if a layout is
	// responding. The ag directive is then removed from the layout effectively
	// removing all styles leaving a clean style definition for mobile and
	// tablet devices.
	//
	// @param {HTMLElement} ele
	//		An ag element
	//

	var respond = function (ele) {
		if (!supportsMediaQueries) {
			return;
		}
	
		var width = attr('ag-res', ele).get(),
			media;
	
		if (width) {
			media = 'screen and (max-width:' + width + 'px)';

			if (mediaMatch(media).matches) {
				removeModifiers(ele);
			}
		}
	};

	
	//
	// @private
	//
	// Creates ag-line elements
	//
	// @param {HTMLElement} ele
	//		An ag element
	//

	var createLines = function (ele) {
		var eles = getVisibleElements(ele).slice(1),
			i = eles.length;
	
		while (i--) {
			ele.insertBefore(createLine(i + 1), eles[i]);
		}
	};

	
	//
	// @private
	//
	// As the name implies, all whitespace nodes are removed from an ag element
	//
	// @param {HTMLElement} ele
	//		An ag element
	//
	
	var removeWhitespace = function (ele) {
		var node = ele.firstChild,
			next;

		while (node) {
			next = node.nextSibling;
		
			if (node.nodeType !== 1) {
				ele.removeChild(node);
			}
		
			node = next;
		}
	};
	
	
	//
	// @private
	//
	// Does the ag directive contain a flip modifier
	//
	// @param {String} modifiers
	//		An ag directives modifiers
	//
	// @returns {Boolen}
	//		True or false if the modifier exists
	//

	var hasFlipModifier = function (modifiers) {
		return /(?:^|\s+)flip(?:\s+|$)/.test(modifiers);
	};

	
	//
	// @private
	//
	// Does the ag directive contain a lines modifier
	//
	// @param {String} modifiers
	//		An ag directives modifiers
	//
	// @returns {Boolen}
	//		True or false if the modifier exists
	//
	
	var hasLinesModifier = function (modifiers) {
		return /(?:^|\s+)lines(?::(?:show|hide):\d)?(?:\s+|$)/.test(modifiers);
	};
	
	
	//
	// @private
	//
	// Does the ag directive contain a align modifier
	//
	// @param {String} modifiers
	//		An ag directives modifiers
	//
	// @returns {Boolen}
	//		True or false if the modifier exists
	//

	var hasAlignModifier = function (modifiers) {
		return /(?:^|\s+)align:[tmb](?:\s+|$)/.test(modifiers);
	};

	
	//
	// @private
	//
	// Does the ag directive contain a space modifier
	//
	// @param {String} modifiers
	//		An ag directives modifiers
	//
	// @returns {Boolen}
	//		True or false if the modifier exists
	//
	
	var hasSpaceModifier = function (modifiers) {
		return /(?:^|\s+)space:[12345](?:\s+|$)/.test(modifiers);
	};
	
	
	//
	// @private
	//
	// Does the ag directive contain a split modifier
	//
	// @param {String} modifiers
	//		An ag directives modifiers
	//
	// @returns {Boolen}
	//		True or false if the modifier exists
	//

	var hasSplitModifier = function (modifiers) {
		return /(?:^|\s+)split:(?:[2345]|[1]\/[23]|[23]\/1|2\/3|3\/2)(?:\s+|$)/.test(modifiers);
	};

	
	//
	// @public
	//
	// Sets the min-height for all ag-cel and ag-line elements. If the align
	// modifier exists, only ag-line elements get a min-height value set.
	// 
	// @param {HTMLElement} ele
	//		An ag element
	//

	var resizeMinHeight = function (ele) {
		var agid = ele.agid,
			store = keyStore.get(agid),
			styles;
	
		if (store.responding) {
			return;
		}
	
		//Sets the min-height value to 0 for all ag-cel and ag-line elements
		//while a new min-height value is being calculated
		attr('ag-reflow', ele).set();
	
		styles = [
			'[ag-id="', agid, '"] > [ag-line] {\n',
				//jshint -W015
				'\tmin-height: ', getMinHeight(ele), ';\n',
			'}'
		].join('');
		
		//Only include ag-cel elements if the align modifier is not present
		if (!store.hasAlignModifier) {
			styles = ['[ag-id="', agid, '"] > [ag-cel],\n', styles].join('');
		}
	
		styleSheet.set(agid, styles);
		attr('ag-reflow', ele).remove();
	};
	
	
	//
	// @public
	//
	// Restores the ag directive and stored modifiers back to a layout
	// 
	// @param {HTMLElement} ele
	//		An ag element
	//

	var applyModifiers = function (ele) {
		var store = keyStore.get(ele.agid);
	
		store.responding = false;
		attr('ag', ele).set(store.modifiers);
	};

	
	//
	// @public
	//
	// Removes the ag directive and all modifiers from a layout
	// 
	// @param {HTMLElement} ele
	//		An ag element
	//
	
	var removeModifiers = function (ele) {
		var agid = ele.agid,
			store = keyStore.get(agid);
	
		store.responding = true;
		attr('ag', ele).remove();
		attr('ag-reflow', ele).set();
		styleSheet.clear(agid);
		attr('ag-reflow', ele).remove();
	};


	//
	// @public
	//
	// The core layout initialization method. This is where all the good stuff
	// happens
	// 
	// @param {HTMLElement} ele
	//		An ag element
	//
	
	var initialize = function (ele) {

		if (ele.agid !== void 0) {
			return;
		}

		var agid = generateAgId(ele),
			store = keyStore.create(agid),
			modifiers;
		
		store.modifiers = modifiers = attr('ag', ele).get();
		store.hasSplitModifier = hasSplitModifier(modifiers);
		store.hasSpaceModifier = hasSpaceModifier(modifiers);
		store.hasAlignModifier = hasAlignModifier(modifiers);
		store.hasLinesModifier = hasLinesModifier(modifiers);
		store.hasFlipModifier = hasFlipModifier(modifiers);

		styleSheet.create(agid);
		removeWhitespace(ele);
		createLines(ele);
		respond(ele);
		resizeMinHeight(ele);
		attr('ag-ready', ele).set();
	};


	return {
		initialize: initialize,
		removeModifiers: removeModifiers,
		applyModifiers: applyModifiers,
		resizeMinHeight: resizeMinHeight
	};
}());
