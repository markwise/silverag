//
// @module
//
// A simple interface to manipulate an element's attributes
//

var attr = (function () {
    'use strict';
    
    var attr,
        ele;
    
    //
    // @private
    //
    // A pass through that dereferences attr and ele before returning
    //
    // If ele wasn't dereferenced, it could cause a potential memory leak if the
    // element was removed from the DOM and ele still referenced it. In this 
    // case, allocated memory for element would never be released.
    //
    // @param {Mixed} val
    //      The return value from one of the five attribute methods
    //
    // @returns {Mixed}
    //      {val}
    //
    
    var reset = function (val) {
        attr = ele = null;
        return val;
    };
    
    
    //
    // @private
    //
    // Splits a string into an array by one or more spaces
    //
    // @param {String} str
    //      The string to convert to an array           
    //
    // @returns {Array}
    //
    
    var toArray = function (str) {
        str = str.trim();
        return str.length ? str.split(/\s+/) : [];
    };
    
    
    //
    // @public
    //
    // Removes a string from the attribute's value
    //
    // @param {String|undefined} val
    //      {String}    
    //      Removes the string from the attribute's value
    //      
    //      {undefined}
    //      Removes the attribute
    //
    
    var remove = function (val) {
        var vals = toArray(get()),
            index;
        
        if (val !== void 0) {
            index = vals.indexOf(val);
            
            if (index > -1) {
                vals.splice(index, 1);
            }
            
            set(vals.join(' '));
        } else {
            ele.removeAttribute(attr);
        }
    };
    
    
    //
    // @public
    //
    // Appends a string to the attribute's value
    //
    // @param {String} val
    //      The new string to append to the attribute's value 
    //
    
    var add = function (val) {
        var vals = toArray(get());
            
        if (val !== void 0) {
            if (!has(val)) {
                vals.push(val);
            }
        }
        
        set(vals.join(' '));
    };
    
    
    //
    // @public
    //
    // Returns true/false if the attribute exists and/or value contains {val}
    //
    // @param {String|undefined} val
    //      {String} 
    //      Checks if the attribute exists and value contains the string
    //
    //      {undefined} 
    //      Checks if the attribute exists 
    //
    // @returns {Boolean}
    //      
    
    var has = function (val) {
        if (ele.hasAttribute(attr)) {
            if (val !== void 0) {
                return toArray(get()).indexOf(val) > -1;
            }
            
            return true;
        }
        
        return false;
    };
    
    
    //
    // @public
    //
    // Sets the attribute's value to {val} or an empty string if {val} is undefined
    //
    // @param {String|undefined} val
    //      {String}
    //      Sets the attribute and value to {val}
    //  
    //      {undefined}
    //      Sets the attribute and value to an empty string
    //
    
    var set = function (val) {
        ele.setAttribute(attr, val || '');
    };
    
    
    //
    // @public
    //
    // Returns an attribute's value or an empty string if the attribute is not
    // defined
    //
    // @returns {String}
    //
        
    var get = function () {
        return (ele.getAttribute(attr) || '').trim();
    };
    
    
    //Public interface
    
    var attrList = {
        
        get: function () {
            return reset(get());
        },
        
        set: function (val) {
            reset(set(val));
        },
        
        has: function (val) {
            return reset(has(val));
        },
        
        add: function (val) {
            reset(add(val));
        },
        
        remove: function (val) {
            reset(remove(val));
        }
    };
    
    
    return function ($attr, $ele) {
        attr = $attr;
        ele =  $ele;
        return attrList;
    };
}());