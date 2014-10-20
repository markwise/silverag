/* global */

//
// @module
//

var watcher = (function () {
    'use strict';

    var timer,
        delay = 250,
        tasks = [],
        $idle = true;

    //
    // @private
    //
    // Recursively calls each function in the task list
    //

    var watch = function () {
        timer = setTimeout(function () {
            var i = tasks.length;
        
            while (i--) {
                tasks[i]();
            }
        
            watch();
        }, delay);
    };


    //
    // @public
    //
    // Stops the timer
    //

    var stop = function () {
        timer = clearTimeout(timer);
        $idle = true;
    };


    //
    // @public
    //
    // Starts the timer if their are tasks to be run
    //

    var start = function () {
        if (!tasks.length) {
            return;
        }
        
        timer = clearTimeout(timer);
        watch();
        $idle = false;
    };


    //
    // @public
    //
    // Adds a task to the task list
    //
    // @param {Function} fn
    //      A function to be added to the watcher task list
    //

    var addTask = function (fn) {
        tasks.push(fn);
    };
    
    
    //
    // @public
    //
    // returns {Boolean}
    //      True if the watcher is stopped and false otherwise
    //
    
    var idle = function () {
        return $idle;
    };
    

    return {
        idle: idle,
        addTask: addTask,
        start: start,
        stop: stop
    };
}());
