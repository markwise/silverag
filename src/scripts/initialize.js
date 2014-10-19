/* global
win,
supportsMediaQueries,
mediaQuery,
layouts,
getLayouts,
domReady,
resize
*/

//
// @module
//

var initialize = (function () {
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
    
    
    domReady.addTask(function () {
        
        //Stop timer to prevent further recursion
        clearTimeout(timer);
        
        //One final attempt to initialize layouts that may have been missed
        //during the documents interactive state
        layouts.initialize();
        
        //Add a window resize task to maintain equal heights
        resize.addTask(layouts.resizeMinHeight);
        
        //Clean up initialize module
        timer = init = initialize = null;
    });
    

    domReady.addTask(function () {
        
        //Exclude IE8
        if (!supportsMediaQueries) {
            return;
        }

        //Initialize JavaScript media queries using the matchMedia API
        for (var i = 480; i <= 960; i += 20) {
            mediaQuery.maxWidth(i);
        }
    });
}());
