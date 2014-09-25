/* global win, layouts */

//
// A module that throttles the window's resize event 
//

var resize = (function () {
    'use strict';
    
    var wait,
        delay = 10,
        tasks = [];
    
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
    } else {
        win.attachEvent('onresize', throttleResize);
    }
    
    return {
    
        //
        // Add a task to the resize task list
        //
        // @param {Function} fn
        //      The function to add to the task list
        //  
        
        addTask: function (fn) {
            tasks.push(fn);
        }
    };
}());

resize.addTask(layouts.resizeMinHeight);