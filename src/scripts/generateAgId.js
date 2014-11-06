//
// @module
//

var generateAgId = (function () {
    'use strict';

    var index = 0;
    
    //
    // @public
    //
    // Generates a universally unique identifier (UUID) for an ag element
    //
    // @params {HTMLElement} ele
    //      An ag element
    //
    // @returns {Number}
    //      Generated UUID
    //
    
    return function (ele) {
        //jshint -W093
        return ele.agid = new Date().getTime() + (index += 1);
    };
}());
    