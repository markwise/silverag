/* global doc */






//
// @public
//
// Returns a list of all layouts in the document unless a selector is passed
// to return a filtered list
//
// @param {String} selector
//      An optional CSS selector that MUST return a filtered list of layouts
//
// @returns {NodeList}      
//
    
var getLayouts = function (selector) {
    'use strict';

    return doc.querySelectorAll(selector || '[ag]');
};