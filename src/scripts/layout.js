/* global classList */

//requires: class_list

var layout = (function () {
    'use strict';
    
    var createSignatureList = function (ele) {
        var match,
            klass = ele.className,
            list = ele.ag.signatureList = [],
            keys = [
                'ag-flip',
                'ag-align:[tmb]',
                'ag-space:\\d',
                'ag-split(?::\\d(?:\\/\\d)?)?'
            ],
            i = keys.length - 1;
        
        do {
            match = klass.match(new RegExp('(?:^|\\s+)(' + keys[i] + ')(?:\\s+|$)'));
            if (match) {
                list.push(match[1]);
            }
        } while (i--);
        
        return list;
    };
    
    
    var getSignatureList = function (ele) {
        var store = ele.ag || (ele.ag = {});
        return store.signatureList || createSignatureList(ele);
    };
    
    
    var removeSignature = function (ele) {
        var a = getSignatureList(ele),
            i = a.length;
        
        while (i--) {
            classList.remove(a[i], ele);
        }
    };
    
    
    var applySignature = function (ele) {
        var a = getSignatureList(ele),
            i = a.length;
        
        while (i--) {
            classList.add(a[i], ele);
        }
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
            } else {
                h.height = Math.max(h.height, ele.offsetHeight);
                j += 1;
            }
        }
        
        return a;
    };
    
    
    var hasLines = function (ele) {
        var store = ele.ag,
            hasLines = store.hasLines,
            eles,
            i;
        
        if (hasLines !== void 0) {
            return hasLines;
        }
    
        eles = getElements(ele);
        i = eles.length;
        
        while (i--) {
            if (classList.contains('ag-line', eles[i])) {
                hasLines = true;
                break;
            }
        }
    
        return (store.hasLines = hasLines || false);
    };
    
    
    var resizeLines = function (ele) {
        
        //add condition if a layout is responding to ignore resize
        if (!hasLines(ele)) {
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
    
    
    var initialize = function (ele) {
        
        //Create store to cache internal layout data
        ele.ag || (ele.ag = {});
        
        resizeLines(ele);
        classList.add('ag-ready', ele);
    };
    
    
    return {
        removeSignature: removeSignature,
        applySignature: applySignature,
        initialize: initialize,
        resizeLines: resizeLines
    };
}());
