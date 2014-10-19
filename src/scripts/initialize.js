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
        clearTimeout(timer);
        //In case layouts were missed
        layouts.initialize();
        //Add a window resize task
        resize.addTask(layouts.resizeMinHeight);
        //Clean up initialize module
        timer = init = initialize = null;
    });


    domReady.addTask(function () {
        if (!supportsMediaQueries) {
            return;
        }

        for (var i = 480; i <= 960; i += 20) {
            mediaQuery.maxWidth(i);
        }
    });
}());
