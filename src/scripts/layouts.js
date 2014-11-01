/* global layout, getLayouts */

//
// @module
//
// A pass through module that iterates through a collection of layouts calling 
// matching methods in the layout module
//

var layouts = (function () {
    'use strict';
    
    //
    // @private
    //
    // A generic delegation function that iterates through a NodeList calling
    // {fn} for each item in {eles} with node as its argument
    //
    // @param {Function} fn
    //      The matching method in the layout module to call on each iteration
    //
    // @param {NodeList|undefined} eles
    //      A collection of layouts to iterate through
    //
    
    var delegate = function (fn, eles) {
        eles || (eles = getLayouts());
        
        var i = eles.length;
        
        while (i--) {
            fn(eles[i]);
        }
    };
    
    
    return {
        initialize: function (eles) {
            delegate(layout.initialize, eles);
        },
    
        removeModifiers: function (eles) {
            delegate(layout.removeModifiers, eles);
        },
        
        applyModifiers: function (eles) {
            delegate(layout.applyModifiers, eles);
        }
    };
}());