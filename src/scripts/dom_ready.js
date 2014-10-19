//
// @module
//

/* jshint ignore:start */
var domReady = (function () {
    'use strict';

    var tasks = [];
    
    
    /*!
     * contentloaded.js
     *
     * Author: Diego Perini (diego.perini at gmail.com)
     * Summary: cross-browser wrapper for DOMContentLoaded
     * Updated: 20101020
     * License: MIT
     * Version: 1.2
     *
     * URL:
     * http://javascript.nwbox.com/ContentLoaded/
     * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
     *
     */
    
    var contentLoaded = function (win, fn) {

        var done = false, top = true,

        doc = win.document, root = doc.documentElement,

        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
        pre = doc.addEventListener ? '' : 'on',

        init = function(e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function() {
            try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
            init('poll');
        };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    };

    contentLoaded(win, function () {
        var l = tasks.length,
            i = 0;
        
        for (; i < l; i++) {
            tasks[i]();
        }
        
        //Clean up
        tasks =
        contentLoaded =
        addTask =
        domReady = null;
    });
    
    
    //
    // @public
    //
    // Adds a task to the domReady task list
    //
    // @param {Function} fn
    //      A function to be added to the domReady task list
    // 
    
    var addTask = function (fn) {
        tasks.push(fn);
    };


    return {
        addTask: addTask
    };
}());
/* jshint ignore:end */
