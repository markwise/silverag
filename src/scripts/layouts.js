/* global
win,
layout,
getLayouts
*/

//requires: class_list
//requires: layout

var layouts = (function () {
    'use strict';

    var delegate = function (fn, eles) {
        eles || (eles = getLayouts());
        var i = eles.length;
        while (i--) {
            fn(eles[i]);
        }
    };


    var removeSignature = function (eles) {
        delegate(layout.removeSignature, eles);
    };
    
    
    var applySignature = function (eles) {
        delegate(layout.applySignature, eles);
    };
    
    
    var initialize = function () {
        delegate(layout.initialize);
    };
    
    
    var resize = function () {
        delegate(layout.resizeLines);
    };
    
    
    //if (!supportsFlexbox) {
    if (win.addEventListener) {
        win.addEventListener('resize', resize);
    } else {
        win.attachEvent('onresize', resize);
    }
    //}
    
    
    return {
        removeSignature: removeSignature,
        applySignature: applySignature,
        initialize: initialize,
        resize: resize
    };
}());
