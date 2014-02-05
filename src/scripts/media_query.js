/* global
doc,
layouts,
mediaMatch
*/

//requires: supports_media_queries
//requires: class_list
//requires: layout
//requires: layouts
//requires: media_match

var mediaQuery = (function () {
    'use strict';

    var getResponsiveLayouts = function (maxWidth) {
        return doc.querySelectorAll('[class~="ag-respond:' + maxWidth + '"]');
    };
    
    
    var maxWidthChange = function (mediaQueryList) {
        var maxWidth = mediaQueryList.media.match(/(\d+)/)[1],
            eles = getResponsiveLayouts(maxWidth);
        
        if (eles.length) {
            if (mediaQueryList.matches) {
                layouts.removeSignature(eles);
            } else {
                layouts.applySignature(eles);
            }
        }
    };
    
    
    var createMaxWidth = function (maxWidth) {
        var media = 'screen and (max-width:' + maxWidth + 'px)',
            mediaQueryList = mediaMatch(media);
        
        mediaQueryList.addListener(maxWidthChange);
        
        return {
            maxWidthChange: function () {
                maxWidthChange(mediaQueryList);
            }
        };
    };
    
    
    return {
        createMaxWidth: createMaxWidth
    };
}());
