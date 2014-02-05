/* global
win,
supportsMediaQueries,
mediaQuery
*/

//requires: supports_media_queries
//requires: class_list
//requires: layout
//requires: layouts
//requires: media_match
//requires: media_query

var initializeResponsiveLayouts = (function () {
    'use strict';
    
    if (!supportsMediaQueries) {
        return;
    }
    
    var mediaQueries = [],
        timer,
        wait = false;
    
    
    var createMediaQueries = (function () {
        var i = 480;
        
        for (; i <= 960; i += 20) {
            mediaQueries.push(mediaQuery.createMaxWidth(i));
        }
    }());
    
    
    var callListeners = function () {
        wait = true;
        
        var i = mediaQueries.length - 1;
        
        do {
            mediaQueries[i].maxWidthChange();
        } while (i--);
        
        wait = false;
    };
    
    
    timer = setInterval(function () {
        wait || callListeners();
    });
    
    
    win.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            clearInterval(timer);
            callListeners();
        });
    });
}());
