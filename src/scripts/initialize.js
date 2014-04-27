/* global
win,
supportsMediaQueries,
mediaQuery,
layouts,
getLayouts,
domReady
*/

//requires: supports_media_queries
//requires: attr_list
//requires: layout
//requires: layouts
//requires: media_match
//requires: media_query

var initialize = (function () {
    'use strict';

    var timer,
        wait = false;
    
    var initializeMediaQueries = function () {
        if (!supportsMediaQueries) {
            return;
        }
    
        for (var i = 480; i <= 960; i += 20) {
            mediaQuery.maxWidth(i);
        }
    };
    
    
    var initializeLayouts = function () {
        wait = true;
        layouts.initialize(getLayouts());
        wait = false;
    };
    
    
    timer = setInterval(function () {
        wait || initializeLayouts();
    });
    
    
    domReady(function () {
        setTimeout(function () {
            clearInterval(timer);
            //One final attempt
            initializeLayouts();
            initializeMediaQueries();
            
            //Clean up
            timer =
            wait =
            initializeLayouts =
            initializeMediaQueries =
            /* jshint -W020 */
            domReady = null;
        });
    });
}());
