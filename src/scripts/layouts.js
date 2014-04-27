/* global
win,
layout,
getLayouts
*/

//requires: attr_list
//requires: layout

var layouts = (function () {
    'use strict';
        
    var delegate = function (fn, eles) {
        eles || (eles = getLayouts());
        
        var l = eles.length,
            i = 0;
        
        for (; i < l; i++) {
            fn(eles[i]);
        }
    };


    var removeModifiers = function (eles) {
        delegate(layout.removeModifiers, eles);
    };
    
    
    var applyModifiers = function (eles) {
        delegate(layout.applyModifiers, eles);
    };
    
    
    var initialize = function (eles) {
        delegate(layout.initialize, eles);
    };
    
    
    var resize = function () {
        delegate(layout.resizeLines);
    };
    
    
    if (win.addEventListener) {
        win.addEventListener('resize', resize);
    } else {
        win.attachEvent('onresize', resize);
    }
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        resize: resize
    };
}());
