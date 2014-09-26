/* global attr */

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
        //jshint -W058, -W007
        var agid = ele.agid || (ele.agid = +new Date + ++index);
        
        attr('ag-id', ele).set(agid);
        
        return agid;
    };
}());
    