/* global win, doc, layout, layouts, getLayouts, attr, keyStore */

//
// @module
//
// Uses MutationObservers to observe when new elements have been added and
// removed from the DOM. This allows layouts to be initialized and cleaned up
// when they are created and destroyed. IE10 uses MutationEvents as a fallback.
// See the MutationObserver and MutationEvents APIs for details.
//

var layoutObserver = (function () {
    'use strict';
    
    //
    // @private
    //
    // Nullifies a removed layout's keyStore object
    //      
    
    var removedNodesMutation = function (ele) {
        
        //Is ele a layout
        if (attr('class', ele).has('ag')) {
            keyStore.remove(ele.agid);
        }
        
        //Are any of ele's descendants a layout
        var eles = ele.querySelectorAll('.ag'),
            i = eles.length;
        
        while (i--) {
            keyStore.remove(eles[i].agid);
        }
    };
    
    
    //
    // @private
    //
    // MutationObserver callback
    //
    
    var mutationCallback = function (records) {
        var i = records.length,
            removedNodes,
            j;
        
        while (i--) {
            removedNodes = records[i].removedNodes;
            j = removedNodes.length;
    
            while (j--) {
                removedNodesMutation(removedNodes[j]);
            }
        }
        
        //Try to initialize new layouts that have been added to the DOM
        layouts.initialize(getLayouts('[ag]:not(.ag)'));
    };
    
    
    //
    // @private
    //
    // MutationEvent listener for IE10
    //
    
    var mutationListener = function (event) {
        var type = event.type,
            target = event.target;
        
        //DOMNodeInserted is fired for parent nodes and their descendants that
        //are added to the DOM
        if (type === 'DOMNodeInserted') {
            if (attr('ag', target).has()) {
                layout.initialize(target);
            }
        
        //DOMNodeRemoved only fires for parent nodes that are removed from the
        //DOM, but not their descendants unlike DOMNodeInserted
        } else
        if (type === 'DOMNodeRemoved') {
            removedNodesMutation(target);
        }
    };

    
    //
    // @public
    //
    // Creates a MutationObserver instance to observe when new elements have been 
    // added and removed from the DOM. IE10 uses MutationEvents as a fallback.
    //
    
    var create = function () {
        var mutationObserver = win.MutationObserver || win.WebKitMutationObserver;
        
        if (mutationObserver) {
            //jshint -W055
            new mutationObserver(mutationCallback).observe(doc.body, {
                childList : true,
                subtree : true
            });
            
        //IE10
        } else
        if (win.MutationEvent) {
            doc.body.addEventListener('DOMNodeInserted', mutationListener);
            doc.body.addEventListener('DOMNodeRemoved', mutationListener);
        }
        
        //Clean up
        layoutObserver = create = null;
    };


    return {
        create: create
    };
}());
