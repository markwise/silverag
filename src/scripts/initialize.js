/* global doc, mediaQueries, layouts, getLayouts, layoutObserver */

//
// @Closure
//
// Initializes silverag
//

(function () {
    'use strict';

    var timer;
    
    //
    // Recursively trys to initialize layouts until the DOM is ready. This
    // provides fast initialization that checks elements as they become 
    // available instead of waiting for all elements to be ready.
    //
    
    var init = function () {
        timer = setTimeout(function () {
            layouts.initialize();
            init();
        });
    };
    
    init();
    
    
    //
    // DOMContentLoaded listener
    //
    
    var domReady = function () {
        //Stop timer to prevent further recursion
        clearTimeout(timer);
        
        //One final attempt to initialize layouts that may have been missed
        layouts.initialize();
        
        //Initialize media queries using the matchMedia API
        mediaQueries.create();
        
        //Initialize new layouts that have been added to the DOM
        layoutObserver.create();
        
        //Clean up
        doc.removeEventListener('DOMContentLoaded', domReady);
        timer = init = null;
    };
    
    doc.addEventListener('DOMContentLoaded', domReady);
}());