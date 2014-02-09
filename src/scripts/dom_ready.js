/* global
win,
doc,
html
*/

var domReady = function (fn) {
    'use strict';

    //A simple DOM ready method that has been abstracted from jQuery and
    //Diego Perini's doscroll check for DOM readiness in IE8

    var init = function (evt) {
        if (evt.type === 'DOMContentLoaded') {
            doc.removeEventListener('DOMContentLoaded', init);
        } else
        if (evt.type === 'load') {
            win.detachEvent('onload', init);
        }
    
        fn();
        init = poll = null;
    };
    
    
    //DOM ready check for IE8
    var poll = function () {
        try {
            html.doScroll('left');
            fn();
            init = poll = null;
        } catch (e) {
            setTimeout(poll, 1);
        }
    };
    
    
    if (doc.addEventListener) {
        doc.addEventListener('DOMContentLoaded', init, false);
    } else {
        if (!win.frameElement) {
            poll();
        } else {
            win.attachEvent('onload', init);
        }
    }
};