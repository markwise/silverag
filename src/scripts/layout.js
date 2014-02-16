/* global
supportsMediaQueries,
classList,
mediaMatch
*/

//requires: supports_media_queries
//requires: class_list
//requires: media_match

var layout = (function () {
    'use strict';
        
    var storeModifiers = function (ele) {
        var match,
            klass = ele.className,
            modifiers = ele.ag.modifiers = [],
            a = [
                'ag-flip',
                'ag-align:[tmb]',
                'ag-space:\\d',
                'ag-split(?::\\d(?:\\/\\d)?)?'
            ],
            i = a.length - 1;
        
        do {
            match = klass.match(new RegExp('(?:^|\\s+)(' + a[i] + ')(?:\\s+|$)'));
            if (match) {
                modifiers.push(match[1]);
            }
        } while (i--);
    };
    
    
    var removeModifiers = function (ele) {
        var a = ele.ag.modifiers,
            i = a.length;
        
        while (i--) {
            classList.remove(a[i], ele);
        }
        
        ele.ag.responding = true;
    };
    
    
    var applyModifiers = function (ele) {
        var a = ele.ag.modifiers,
            i = a.length;
        
        while (i--) {
            classList.add(a[i], ele);
        }
        
        ele.ag.responding = false;
    };
    
    
    var setLinesMinHeight = function (data) {
        var lines = data.lines,
            i = lines.length;
        
        while (i--) {
            lines[i].style.minHeight = data.height + 'px';
        }
    };
    
    
    var getMaxColsPerRow = function (ele) {
        var store = ele.ag,
            count = store.maxColsPerRow,
            match;
    
        if (count !== void 0) {
            return count;
        }
        
        match = ele.className.match(/ag-split:(\d(?:\/\d)*)/);
        
        if (match) {
            match = match[1];
            count = match.split('/').length;
            
            if (count === 1) {
                count = +match;
            }
        }
        
        return (store.maxColsPerRow = count);
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
    
    
    var getLineDataPerRow = function (node) {
        var eles = getElements(node),
            l = eles.length,
            i = 0,
            ele,
            j = 0,
            maxColsPerRow = getMaxColsPerRow(node) || l,
            h,
            a = [];
        
        for (; i < l; i++) {
            ele = eles[i];
            
            if (j % maxColsPerRow === 0) {
                h = {
                    lines: [],
                    height: 0
                };
                a.push(h);
            }
            
            //ele is an ag-line
            if (classList.contains('ag-line', ele)) {
                h.lines.push(ele);
            
            //ele is an ag-cel
            } else
            if (!classList.contains('ag-show', ele)) {
                h.height = Math.max(h.height, ele.offsetHeight);
                j += 1;
            }
        }
        
        return a;
    };
    
    
    var hasLines = function (ele) {
        var eles = getElements(ele),
            i = eles.length;
        
        while (i--) {
            if (classList.contains('ag-line', eles[i])) {
                return true;
            }
        }
    
        return false;
    };
    
    
    var resizeLines = function (ele) {
        var store = ele.ag;
        
        if (!(store.lines && !store.responding)) {
            return;
        }
        
        //Set lines min-height to 0 while new min-height is being calculated
        classList.add('ag-reflow', ele);
        
        var data = getLineDataPerRow(ele),
            i = data.length;
        
        while (i--) {
            setLinesMinHeight(data[i]);
        }
        
        classList.remove('ag-reflow', ele);
    };
    
    
    var initializeResponsiveLayout = function (ele) {
        if (!supportsMediaQueries) {
            return;
        }
    
        var match = ele.className.match(/ag-respond:(\d+)/),
            media;
        
        if (match) {
            media = 'screen and (max-width:' + match[1] + 'px)';
           
            if (mediaMatch(media).matches) {
                removeModifiers(ele);
            }
        }
    };
    
    
    var initialize = function (ele) {
        
        //Create store to cache internal layout data
        var store = ele.ag || (ele.ag = {});
        
        if (store.ready) {
            return;
        }
        
        store.ready = false;
        store.responding = false;
        store.lines = hasLines(ele);
        storeModifiers(ele);
        
        initializeResponsiveLayout(ele);
        resizeLines(ele);
        
        classList.add('ag-ready', ele);
        store.ready = true;
    };
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        resizeLines: resizeLines
    };
}());
