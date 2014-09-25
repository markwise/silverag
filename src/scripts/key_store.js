//
// A module that creates and gets a key/value store for an ag layout based on a
// UUID (agid)
//

var keyStore = (function () {
    'use strict';

    var store = {};

    return {
        create: function (agid) {
            return (store[agid] = {});
        },
        
        get: function (agid) {
            return store[agid];
        }
    };
}());