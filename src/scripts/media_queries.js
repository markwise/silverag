/* global doc, layouts, matchMedia, getLayouts */

//
// @module
//
// Registers media queries using the matchMedia API. This is used in favor of
// media queries written in CSS because it's less verbose. Otherwise, a media
// query would have to be written for each max-width value we want a layout to
// respond to. See the matchMedia API for details.
//

var mediaQueries = (function () {
    'use strict';

    //
    // @private
    //
    // A Listener registered with matchMedia
    //
    // @param {MediaQueryList} mql
    //      A MediaQueryList object passed to the listener
    //
    
    var maxWidthChange = function (mql) {
        var maxWidth = mql.media.match(/(\d+)/)[1],
            eles = getLayouts('[ag-res="' + maxWidth + '"]');
    
        if (eles.length) {
            if (mql.matches) {
                layouts.removeModifiers(eles);
            } else {
                layouts.applyModifiers(eles);
            }
        }
    };
    
    
    //
    // @public
    //
    // Create media queries from 480 to 960 in increments of 20 that listen for
    // changes in max-width
    //
    
    var create = function () {
        var media, i;
    
        for (i = 480; i <= 960; i += 20) {
            media = 'screen and (max-width:' + i + 'px)';
            matchMedia(media).addListener(maxWidthChange);
        }
        
        //Clean up
        mediaQueries = create = null;
    };
    
    
    return {
        create: create
    };
}());
