//
// @module
//
// Creates a key/value store for an ag layout
//

var keyStore = (function () {
    'use strict';

    var store = {};

    return {
    
        //
        // @public
        //
        // Creates a new key/value store for a layout by {agid}
        //
        // @params {String} agid
        //      The UUID associated with a layout
        //
        
        create: function (agid) {
            return (store[agid] = {});
        },
        
        
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
        
        get: function (agid) {
            return store[agid];
        }
    };
}());