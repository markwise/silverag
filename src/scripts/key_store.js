//
// @module
//
// Manages a layout's key/value store
//

var keyStore = (function () {
    'use strict';

    var store = {};

    //
    // @public
    //
    // Creates a new key/value store for a layout by {agid}
    //
    // @params {String} agid
    //      The UUID associated with a layout
    //
    
    var create = function (agid) {
        //jshint -W093
        return store[agid] = {};
    };
    
    
    //
    // @public
    //
    // Removes a layouts key/value store from memory when a layout is removed
    // from the DOM
    //
    // @params {String} agid
    //      The UUID associated with a layout
    //
    
    var remove = function (agid) {
        store[agid] = null;
    };
    
    
    //
    // @public
    //
    // Returns the key/value store associated with a layout by {agid}
    //
    // @params {String} agid
    //      The UUID associated with a layout
    //
    // @returns {Object}
    //      The key/value store
    //
    
    var get = function (agid) {
        return store[agid];
    };


    return {
        create: create,
        remove: remove,
        get: get
    };
}());
