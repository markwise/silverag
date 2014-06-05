/* global
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
        var eles = getElements(ele),
            i = eles.length;
        
        while (i--) {
            attr('style', eles[i]).remove();
        }
    };
    
    
    var removeModifiers = function (ele) {
        attr('ag', ele).remove();
        attr('ag-reflow', ele).set();
        removeMinHeight(ele);
        attr('ag-reflow', ele).remove();
        ele.silverag.isResponding = true;
    };
    
    
    var applyModifiers = function (ele) {
        attr('ag', ele).set(ele.silverag.modifiers);
        ele.silverag.isResponding = false;
    };
    
    
    var getMinHeight = function (eles) {
        var i = eles.length,
            a = [],
            ele;
        
        while (i--) {
            ele = eles[i];
            
            if (attr('ag-cel', ele).has()) {
                a.push(ele.offsetHeight);
            }
        }
        
        return Math.max.apply(null, a);
    };
    
    
    var calculateMinHeight = function (ele) {
        if (ele.silverag.isResponding) {
            return;
        }
    
        attr('ag-reflow', ele).set();
        
        var eles = getElements(ele),
            minHeight = getMinHeight(eles),
            i = eles.length;
        
        while (i--) {
            eles[i].style.minHeight = minHeight + 'px';
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
    
    
    var filter = function (eles, filter) {
        var i = eles.length,
            a = [],
            ele;
        
        while (i--) {
            ele = eles[i];
            if (attr(filter, ele).has()) {
                a.push(ele);
            }
        }
        
        return a;
    };
    
    
    var getElements = function (ele) {
        var node = ele.firstChild,
            a = [];

        while (node) {
            if (node.nodeType === 1) {
                a.push(node);
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
        store.isResponding = false;
        store.modifiers = modifiers = attr('ag', ele).get();
        store.hasSplitModifier = hasSplitModifier(ele, modifiers);
        store.hasAlignModifier = hasAlignModifier(ele, modifiers);
        store.hasSpaceModifier = hasSpaceModifier(ele, modifiers);
        store.hasFlipModifier = hasFlipModifier(ele, modifiers);
        store.eles = eles = getElements(ele);
        store.cels = filter(eles, 'ag-cel');
        store.lines = filter(eles, 'ag-line');
        store.hasLines = !!store.lines.length;
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
