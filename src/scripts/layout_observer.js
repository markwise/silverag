/* global 
doc, 
layouts, 
WebKitMutationObserver, 
MutationEvent, 
getLayouts, 
attr, 
keyStore 
*/

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
    // Trys to initialize new layouts when an element has been added to the DOM
    // unless the element is an ag-line. Since ag-line elements are not layouts
    // and contain no children, they are ignored to prevent further action.
    //
            
    var addedNodesMutation = function (ele) {
        if (!attr('ag-line', ele).has()) {
            layouts.initialize(getLayouts('[ag]:not(.ag-ready)'));
        }
    };
    
    
    //
    // @private
    //
    // Sets the keyStore object to null for any layouts that are removed from
    // the DOM
    //      
    
    var removedNodesMutation = function (ele) {
        
        //Check ele
        if (attr('class', ele).has('ag-ready')) {
            keyStore.remove(ele.agid);
        }
        
        //Check ele's descendants
        var eles = ele.querySelectorAll('.ag-ready'),
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
            record,
            addedNodes,
            removedNodes,
            j;
        
        while (i--) {
            record = records[i];
            addedNodes = record.addedNodes;
            removedNodes = record.removedNodes;
            j = removedNodes.length;
            
            //Have nodes been removed
            if (j) {
                while (j--) {
                    removedNodesMutation(removedNodes[j]);
                }
            }
            
            //Have nodes been added
            if (addedNodes.length) {
                addedNodesMutation(addedNodes[0]);
            }
        }
    };
    
    
    //
    // @private
    //
    // MutationEvent listener
    //
    
    var mutationListener = function (event) {
        var type = event.type;
    
        if (type === 'DOMNodeInserted') {
            addedNodesMutation(event.target);
        } else
        if (type === 'DOMNodeRemoved') {
            removedNodesMutation(event.target);
        }
    };

    
    //
    // @public
    //
    // Creates a MutationObserver instance to observe when new elements have been 
    // added and removed from the DOM. IE10 uses MutationEvents as a fallback.
    //
    
    var create = function () {
        var mutationObserver = MutationObserver || WebKitMutationObserver;
        
        if (mutationObserver) {
            //jshint -W055
            new mutationObserver(mutationCallback).observe(doc.body, {
                childList : true,
                subtree : true
            });
            
        //IE10
        } else
        if (MutationEvent) {
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
