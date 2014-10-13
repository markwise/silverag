/* global win, supportsMediaQueries, resize */

//matchMedia polyfill for IE9, SA5, iOS4.2

//jshint -W079
var matchMedia = win.matchMedia || (function () {
    'use strict';
    
    //Exclude IE8
    if (!supportsMediaQueries) {
        return;
    }
    
    var mediaQueryList = [],
        wait;
    
    
    //
    // @private
    //
    // Iterate through each mediaQueryList object checking for a match
    // 
    
    var checkMedia = function () {
        wait || (wait = setTimeout(function () {
            var i = mediaQueryList.length,
                item,
                matches;
    
            while (i--) {
                item = mediaQueryList[i];
                matches = win.styleMedia.matchMedium(item.media);
            
                if (item.matches !== matches) {
                    item.matches = matches;
                
                    //Call listener
                    if (item.fn) {
                        item.fn(item);
                    }
                }
            }
            
            wait = void 0;
        }));
    };

    
    //
    // @public
    //
    // Registers a listener with the calling mediaQueryList object
    //        
    // @param {Function} fn
    //      Callback function to invoke if media is a match
    //
    
    var addListener = function (fn) {
        this.fn = fn;
        mediaQueryList.push(this);
    };
    
    
    //Register a window resize task        
    resize.addTask(checkMedia);


    return function (media) {
        return {
            matches: win.styleMedia.matchMedium(media),
            media: media,
            addListener: addListener
        };
    };
}());
            