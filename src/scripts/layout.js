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
    
    
    var initialize = function (ele) {
        
        //Create store to cache internal layout data
        var store = ele.silverag || (ele.silverag = {});
        
        if (store.isReady) {
            return;
        }
        
        store.isReady = true;
        store.isResponding = false;
        store.modifiers = attr('ag', ele).get();
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
