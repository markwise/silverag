/* global win, doc, addEvent, removeEvent, watcher */

//
// @module
//

var resize = (function () {
    'use strict';

    var wait,
        delay = 10,
        tasks = [],
        noresize;
    
    //
    // @private
    //
    // Throttles the windows resize event based on {delay} and the amount
    // of time it takes to complete the resize task list
    //
    
    var throttleResize = function () {
        wait || (wait = setTimeout(function () {
            var i = tasks.length;
            
            while (i--) {
                tasks[i]();
            }
            
            wait = void 0;
        }, delay));
    };
    
    
    //
    // @private
    //
    // A temporary click event handler to restart the watcher. The event only
    // fires once before being removed. 
    //
    
    var clickEvent = function () {
        removeEvent('click', doc, clickEvent);
        watcher.start();
    };
    
    
    //
    // @private
    //
    // A pass through call to throttleResize that stops the watcher if it's
    // active and registers a temporary click event to restart the watcher
    // on the next click event that occurs
    //
    
    var resizeEvent = function () {
        if(!watcher.idle()) {
            watcher.stop();
            addEvent('click', doc, clickEvent);
        }
    
        throttleResize();
    };
    
    addEvent('resize', win, function () {
        noresize || resizeEvent();
    });
    
    
    //
    // @public
    //
    // This method disables or enables the resize modules window resize 
    // event in IE8
    //
    // IE8 fires a resize event when the height of an element is changed
    // regardless if the window was actually resized. Because the resize 
    // event is used to adjust height values of ag elements, we end up in an
    // infinite loop each time a height value is changed. The infinite loop
    // is avoided by first disabling the resize event, changing styles and 
    // then re-enabling the resize event.
    //
    // @param {Boolean} flag
    //      Enables/disables resize event in IE8
    //
    
    var preventResizeIE8 = function (flag) {
        noresize = flag;
    };
    
    
    //
    // @public
    //
    // Adds a task to the resize task list
    //
    // @param {Function} fn
    //      The function to be added to the resize task list
    //  
    
    var addTask = function (fn) {
        tasks.push(fn);
    };
    
    
    return {
        addTask: addTask,
        preventResizeIE8: preventResizeIE8
    };
}());
