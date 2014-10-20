/* global win */

//
// Functions to add and remove events
//

var addEvent = (function () {
    'use strict';

    if (win.addEventListener) {
        return function (evt, ele, fn) {
            ele.addEventListener(evt, fn, false);
        };
    } else {
        return function (evt, ele, fn) {
            ele.attachEvent('on' + evt, fn);
        };
    }
}());


var removeEvent = (function () {
    'use strict';

    if (win.removeEventListener) {
        return function (evt, ele, fn) {
            ele.removeEventListener(evt, fn, false);
        };
    } else {
        return function (evt, ele, fn) {
            ele.detachEvent('on' + evt, fn);
        };
    }
}());
