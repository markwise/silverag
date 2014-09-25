// jshint -W058, -W007

//
// Generates a universally unique identifier (UUID) for a layout
//
// @params {HTMLElement} ele
//      An ag layout
//
// @returns {Number}
//      Generated UUID 
//

var generateAgId = (function () {
    'use strict';

    var index = 0;

    return function (ele) {
        return ele.agid || (ele.agid = +new Date + ++index);
    };
}());