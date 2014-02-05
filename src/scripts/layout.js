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
        
        //The class ag-1 is an internal code that means a responsive layout is 
        //ready. The presence of this class removes styles that are used during 
        //page load through negation, i.e., :not(.ag-1).
        classList.add('ag-1', ele);
        
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
    
    
    return {
        removeSignature: removeSignature,
        applySignature: applySignature
    };
}());
