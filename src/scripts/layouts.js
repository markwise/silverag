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
    
    
    var resizeMinHeight = function () {
        delegate(layout.resizeMinHeight);
    };
    
    
    return {
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        initialize: initialize,
        resizeMinHeight: resizeMinHeight
    };
}());
