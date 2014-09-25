/* global
win,
doc,
supportsMediaQueries,
attr,
mediaMatch,
generateAgId,
keyStore
*/

//requires: supports_media_queries
//requires: generate_agid
//requires: key_store
//requires: attr_list
//requires: media_match

var layout = (function () {
    'use strict';
    
    var removeMinHeight = function (ele) {
		var store = keyStore.get(ele.agid),
			eles = store.hasAlignModifier ? store.lines : store.eles,
			i = eles.length,
			style,
			match;
		
		while (i--) {
			ele = eles[i];
			style = attr('style', ele).get();
			match = style.match(/min-height:\s*\d+(?:\.\d+)?px;/g);
			
			if (match) {
				attr('style', ele).remove(match[0]);
			}
		}
	};
	
	
	var removeModifiers = function (ele) {
		var store = keyStore.get(ele.agid);
		attr('ag', ele).remove();
		attr('ag-reflow', ele).set();
		removeMinHeight(ele);
		attr('ag-reflow', ele).remove();
		store.responding = true;
	};
	
	
	var applyModifiers = function (ele) {
		var store = keyStore.get(ele.agid);
		attr('ag', ele).set(store.modifiers);
		store.responding = false;
	};
	
	
	var getContentMaxHeight = function (ele) {
		var store = keyStore.get(ele.agid),
			eles = store.eles,
			i = eles.length,
			a = [];
		
		while (i--) {
			a.push(eles[i].offsetHeight);
		}
		
		return Math.max.apply(null, a);
	};
	
	
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
				height = getContentMaxHeight(ele) + 'px';
			}
		}
		
		return height;
	};
	
	
	var calculateMinHeight = function (ele) {
		var store = keyStore.get(ele.agid);
		
		if (store.responding) {
			return;
		}
	
		attr('ag-reflow', ele).set();
		
		var eles = store.hasAlignModifier ? store.lines : store.eles,
			i = eles.length,
			minHeight = getMinHeight(ele);
		
		while (i--) {
			eles[i].style.minHeight = minHeight;
		}
		
		attr('ag-reflow', ele).remove();
	};
	
	
	var initializeResponsiveLayout = function (ele) {
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
	
	
	var createLine = function (lines, index) {
		var fragment = doc.createDocumentFragment(),
			line = doc.createElement('div');
		
		lines.push(line);
		attr('ag-line', line).set(index);
		//Safari requires a tab character
		fragment.appendChild(doc.createTextNode('\u0009'));
		fragment.appendChild(line);
		fragment.appendChild(doc.createTextNode('\u0009'));
		
		return fragment;
	};
	
	
	var createLines = function (ele, cels, lines) {
		var eles = cels.slice(1),
			i = eles.length;
		
		while (i--) {
			ele.insertBefore(createLine(lines, i + 1), eles[i]);
		}
	};
	
	
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
	
	
	var hasFlipModifier = function (ele, modifiers) {
		return /(?:^|\s+)flip(?:\s+|$)/.test(modifiers);
	};
	
	
	var hasAlignModifier = function (ele, modifiers) {
		return /(?:^|\s+)align:[tmb](?:\s+|$)/.test(modifiers);
	};
	
	
	var hasSpaceModifier = function (ele, modifiers) {
		return /(?:^|\s+)space:[12345](?:\s+|$)/.test(modifiers);
	};
	
	
	var hasSplitModifier = function (ele, modifiers) {
		return /(?:^|\s+)split:(?:[2345]|[1]\/[23]|[23]\/1|2\/3|3\/2)(?:\s+|$)/.test(modifiers);
	};
	
	
	var hasLineModifier = function (ele, modifiers) {
		return /(?:^|\s+)lines(?::(?:show|hide):\d)?(?:\s+|$)/.test(modifiers);
	};
	
	
	var initialize = function (ele) {

		if (ele.agid !== void 0) {
			return;
		}
		
		var agid = generateAgId(ele),
			store = keyStore.create(agid),
			modifiers;
		
		store.responding = false;
		store.modifiers = modifiers = attr('ag', ele).get();
		store.hasSplitModifier = hasSplitModifier(ele, modifiers);
		store.hasAlignModifier = hasAlignModifier(ele, modifiers);
		store.hasSpaceModifier = hasSpaceModifier(ele, modifiers);
		store.hasFlipModifier = hasFlipModifier(ele, modifiers);
		store.hasLineModifier = hasLineModifier(ele, modifiers);
		removeWhitespace(ele);
		store.cels = getVisibleElements(ele);
		store.lines = [];
		createLines(ele, store.cels, store.lines);
		store.eles = getVisibleElements(ele);
		initializeResponsiveLayout(ele);
		calculateMinHeight(ele);
		attr('ag-ready', ele).set();
	};
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        calculateMinHeight: calculateMinHeight
    };
}());
