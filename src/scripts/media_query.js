/* global
doc,
layouts,
matchMedia
*/

//requires: supports_media_queries
//requires: attr_list
//requires: layout
//requires: layouts
//requires: media_match

var mediaQuery = (function () {
    'use strict';
        
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
    
    
    var maxWidth = function (width) {
        var media = 'screen and (max-width:' + width + 'px)';
        matchMedia(media).addListener(maxWidthChange);
    };
    
    
    return {
        maxWidth: maxWidth
    };
}());
