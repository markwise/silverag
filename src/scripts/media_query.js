/* global doc, layouts, matchMedia, getLayouts */

//
// @module
//
// Registers media queries using the matchMedia API. This is used in favor of
// media queries written in CSS because it's less verbose. Otherwise, a media
// query would have to be written for each max-width value that repeats the same
// style rules bloating the file size.
//

var mediaQuery = (function () {
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
    // Registers an event listener to be called when the max-width value of the
    // screen changes. See the matchMedia API for more details.
    //
    // @param {Number|String} width
    //      The max-width value to register a listener with
    //
    
    var maxWidth = function (width) {
        var media = 'screen and (max-width:' + width + 'px)';
        matchMedia(media).addListener(maxWidthChange);
    };
    
    
    return {
        maxWidth: maxWidth
    };
}());
