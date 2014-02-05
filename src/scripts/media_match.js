/* global
win, 
supportsMediaQueries
*/

//requires: supports_media_queries

var mediaMatch = win.matchMedia || (function () {
    'use strict';
    
    //matchMedia polyfill for IE9, SA5, iOS4.2
    
    if (!supportsMediaQueries) {
        return;
    }
    
    var listeners = [],
        wait;
    
    
    var addListener = function (fn) {
        this.fn = fn;
        listeners.push(this);
    };
    
    
    var resize = function () {
        wait = true;
    
        var i = listeners.length,
            item,
            matches;
    
        while (i--) {
            item = listeners[i];
            matches = win.styleMedia.matchMedium(item.media);
            
            if (item.matches !== matches) {
                item.matches = matches;
                
                //Call listener
                if (item.fn) {
                    item.fn(item);
                }
            }
        }
        
        wait = false;
    };
    
    
    win.addEventListener('resize', function () {
        wait || resize();
    });


    return function (media) {
        return {
            matches: win.styleMedia.matchMedium(media),
            media: media,
            addListener: addListener
        };
    };
}());
            