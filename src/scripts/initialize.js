/* global doc, mediaQuery, layouts, getLayouts */

//
// @Closure
//
// Initializes silverag
//

(function () {
    'use strict';

    var timer;
    
    //
    // @private
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
    // @private
    //
    // DOMContentLoaded listener
    //
    
    var domReady = function () {
        //Stop timer to prevent further recursion
        clearTimeout(timer);
        
        //One final attempt to initialize layouts that may have been missed
        layouts.initialize();
        
        //Initialize media queries using the matchMedia API
        for (var i = 480; i <= 960; i += 20) {
            mediaQuery.maxWidth(i);
        }
        
        //Clean up
        doc.removeEventListener('DOMContentLoaded', domReady);
        timer = init = null;
    };
    
    doc.addEventListener('DOMContentLoaded', domReady);
}());
