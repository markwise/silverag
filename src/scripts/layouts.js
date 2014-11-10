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
    
    
    //
    // @public
    //
    // Initializes a list of layouts
    //
    // @param {NodeList} eles
    //      An optional list of layouts to initialize
    //
    
    var initialize = function (eles) {
        delegate(layout.initialize, eles);
    };
    
    
    //
    // @public
    //
    // Removes ag modifiers from a list of layouts
    //
    // @param {NodeList} eles
    //      An optional list of layouts to remove ag modifiers from
    //

    var removeModifiers = function (eles) {
        delegate(layout.removeModifiers, eles);
    };
    
    
    //
    // @public
    //
    // Reapplies ag modifiers to a list of layouts
    //
    // @param {NodeList} eles
    //      An optional list of layouts to reapply ag modifiers to
    //
    
    var applyModifiers = function (eles) {
        delegate(layout.applyModifiers, eles);
    };
    
    
    return {
        initialize: initialize,
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers
    };
}());