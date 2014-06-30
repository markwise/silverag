/* global
win,
doc,
supportsMediaQueries,
attr,
mediaMatch
*/

//requires: supports_media_queries
//requires: attr_list
//requires: media_match

var layout = (function () {
    'use strict';
    
    var removeMinHeight = function (ele) {
        var store = ele.silverag,
            eles = store.hasAlignModifier ? store.lines : store.eles,
            i = eles.length,
            style,
            match;
        
        while (i--) {
            ele = eles[i];
            style = attr('style', ele).get();
            match = style.match(/min-height:\s*\d+px;/g);
            
            if (match) {
                attr('style', ele).remove(match[0]);
            }
        }
    };
    
    
    var removeModifiers = function (ele) {
        attr('ag', ele).remove();
        attr('ag-reflow', ele).set();
        removeMinHeight(ele);
        attr('ag-reflow', ele).remove();
        ele.silverag.responding = true;
    };
    
    
    var applyModifiers = function (ele) {
        attr('ag', ele).set(ele.silverag.modifiers);
        ele.silverag.responding = false;
    };
    
    
    var getContentMaxHeight = function (ele) {
        var eles = ele.silverag.eles,
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
        if (ele.silverag.responding) {
            return;
        }
    
        attr('ag-reflow', ele).set();
        
        var store = ele.silverag,
            eles = store.hasAlignModifier ? store.lines : store.eles,
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
    
    
    var createLine = function (lines) {
        var fragment = doc.createDocumentFragment(),
            line = doc.createElement('div');
        
        lines.push(line);
        attr('ag-line', line).set();
        fragment.appendChild(doc.createTextNode(' '));
        fragment.appendChild(line);
        fragment.appendChild(doc.createTextNode(' '));
        
        return fragment;
    };
    
    
    var createLines = function (ele, cels, lines) {
        var eles = cels.slice(1),
            i = eles.length;
        
        while (i--) {
            ele.insertBefore(createLine(lines), eles[i]);
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
        return /(?:^|\s+)lines(?:\s+|$)/.test(modifiers);
    };
    
    
    var initialize = function (ele) {

        //Create store to cache internal layout data
        var store = ele.silverag || (ele.silverag = {}),
            modifiers,
            eles;
        
        //Initialize once
        if (store.initialized !== void 0) {
            return;
        }
        
        store.initialized = false;
        store.responding = false;
        store.modifiers = modifiers = attr('ag', ele).get();
        store.hasSplitModifier = hasSplitModifier(ele, modifiers);
        store.hasAlignModifier = hasAlignModifier(ele, modifiers);
        store.hasSpaceModifier = hasSpaceModifier(ele, modifiers);
        store.hasFlipModifier = hasFlipModifier(ele, modifiers);
        store.hasLineModifier = hasLineModifier(ele, modifiers);
        store.cels = getVisibleElements(ele);
        store.lines = [];
        createLines(ele, store.cels, store.lines);
        store.eles = getVisibleElements(ele);
        initializeResponsiveLayout(ele);
        calculateMinHeight(ele);
        attr('ag-ready', ele).set();
        store.initialized = true;
    };
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        calculateMinHeight: calculateMinHeight
    };
}());
