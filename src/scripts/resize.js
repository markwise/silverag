/* global win, layouts */

//
// @module
//
// Throttles the window resize event
//

var resize = (function () {
    'use strict';

    var wait,
        delay = 0,
        tasks = [],
        noresize;
    
    var throttleResize = function () {
        wait || (wait = setTimeout(function () {
            var i = tasks.length;
            
            while (i--) {
                tasks[i]();
            }
            
            wait = void 0;
        }, delay));
    };
            
    if (win.addEventListener) {
        win.addEventListener('resize', throttleResize);
    
    //IE8
    } else {
        win.attachEvent('onresize', function () {
            noresize || throttleResize();
        });
    }
    
    return {
    
        //
        // @public
        //
        // Adds a task to the resize task list
        //
        // @param {Function} fn
        //      The function to add to the task list
        //  
        
        addTask: function (fn) {
            tasks.push(fn);
        },
        
        
        //
        // @public
        //
        // This method disables or enables the resize modules window resize 
        // event in IE8
        //
        // IE8 fires a resize event when the height of an element is changed
        // regardless if the window was actually resized. Because the resize 
        // event is used to adjust height values of ag elements, we end up in an
        // endless loop each time a height value is changed. By first disabling
        // the resize event, changing styles and then re-enabling the resize 
        // event, well...crisis averted for a browser that doesn't deserve it.
        //
        // @param {Boolean} flag
        //      Enables/disables resize event in IE8
        //
        
        preventResizeIE8: function (flag) {
            noresize = flag;
        }
    };
}());

resize.addTask(layouts.resizeMinHeight);
