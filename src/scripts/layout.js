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
    
    var removeModifiers = function (ele) {
        attr('ag', ele).remove();
        ele.silverag.isResponding = true;
    };
    
    
    var applyModifiers = function (ele) {
        attr('ag', ele).set(ele.silverag.modifiers);
        ele.silverag.isResponding = false;
    };
    
    
    var getRowData = function (ele) {
        var node = ele.firstChild,
            data = {
                cels: [],
                lines: [],
                heights: []
            };
    
        while (node) {
            if (node.nodeType === 1) {
                if (attr('ag-cel', node).has()) {
                    data.cels.push(node);
                    data.heights.push(node.offsetHeight);
                }
                
                if (attr('ag-line', node).has()) {
                    data.lines.push(node);
                }
            }
            
            node = node.nextSibling;
        }

        return data;
    };
    

    var setMinHeight = function (ele) {
        var data = getRowData(ele),
            lines = data.lines,
            i = lines.length,
            height = Math.max.apply(null, data.heights);
        
        while (i--) {
            lines[i].style.minHeight = height + 'px';
        }
    };
    
    
    var hasLines = function (ele) {
        return !!getRowData(ele).lines.length;
    };
    
    
    var resizeLines = function (ele) {
        var store = ele.silverag;
        
        if (!(store.hasLines && !store.isResponding)) {
            return;
        }
        
        //Set lines min-height to 0 while new min-height is being calculated
        attr('ag-reflow', ele).set();
        setMinHeight(ele);
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
        store.hasLines = hasLines(ele);
        store.modifiers = attr('ag', ele).get();
        initializeResponsiveLayout(ele);
        resizeLines(ele);
        attr('ag-ready', ele).set();
    };
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        resizeLines: resizeLines
    };
}());
