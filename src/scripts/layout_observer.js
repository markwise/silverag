/* global doc, layouts, WebKitMutationObserver, MutationEvent */

//
// @module
//
// Initializes new layouts that have been added to the DOM using
// MutationObservers for supporting browsers and MutationEvents as a fallback
// for IE10. See the MutationObserver and MutationEvents APIs for details.
//

var layoutObserver = (function () {
    'use strict';

    //
    // @private
    //
    // Callback that intializes new layouts that have been added to the DOM
    //
    
    var observeAddedLayouts = function () {
        layouts.initialize();
    };

    
    //
    // @public
    //
    // Creates a MutationObserver instance to start observing when new elements
    // have been added to the DOM. IE10 uses MutationEvents as a fallback.
    //
    
    var create = function () {
        var mutationObserver = MutationObserver || WebKitMutationObserver;
    
        if (mutationObserver) {
            //jshint -W055
            new mutationObserver(observeAddedLayouts).observe(doc.body, {
                childList : true,
                subtree : true
            });
            
        //IE10
        } else
        if (MutationEvent) {
            doc.body.addEventListener('DOMNodeInserted', observeAddedLayouts);
        }
    };


    return {
        create: create
    };
}());
