/* global doc, layouts, matchMedia */

//
// @module
//
// Registers media queries using the matchMedia API
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
            eles = doc.querySelectorAll('[ag-res="' + maxWidth + '"]');
    
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
