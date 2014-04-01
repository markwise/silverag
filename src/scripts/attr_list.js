var attr = (function () {
    'use strict';
    
    var attr;
    var ele;
    
    var trim = (function () {
        if (''.trim) {
            return function (str) {
                return str.trim();
            };
        } else {
            return function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
        }
    }());
    
    
    var reset = function () {
        attr = null;
        ele  = null;
    };
    
    
    var toArray = function (str, del) {
        str = trim(str);
        del || (del = /\s+/);
        return str.length ? str.split(del) : [];
    };
    
        
    var get = function (asArray) {
        var val = ele.getAttribute(attr) || '';
        return asArray ? toArray(val) : trim(val);
    };
        
        
    var set = function (val) {
        ele.setAttribute(attr, val || '');
    };
        
        
    var has = function (val) {
        var i, 
            str;
    
        if (ele.hasAttribute(attr)) {
            if (val !== void 0) {
                val = toArray(val);
                i = val.length;
                str = get();
                
                while (i--) {
                    if (str.indexOf(val[i]) < 0) {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        return false;
    };
        
        
    var add = function (val) {
        var vals = get(true),
            i, 
            item;
            
        if (val !== void 0) {
            val = toArray(val);
            i = val.length;
            item;
        
            while (i--) {
                item = val[i];
                
                if (!has(item)) {
                    vals.push(item);
                }
            }
        }
        
        set(vals.join(' '));
    };
        
    
    var remove = function (val) {
        var vals = get(true),
            i,
            j;
        
        if (val !== void 0) {
            val = toArray(val);
            i = val.length;
           
            while (i--) {
                j = vals.length;
                
                while (j--) {
                    if (vals[j] === val[i]) {
                        vals.splice(j, 1);
                    }
                }
            }
            
            set(vals.join(' '));
        } else {
            ele.removeAttribute(attr);
        }
    };
    
    
    var attrList = {
        
        get: function (asArray) {
            var r = get(asArray);
            reset();
            return r;
        },
        
        set: function (val) {
            set(val);
            reset();
        },
        
        has: function (val) {
            var r = has(val);
            reset();
            return r;
        },
        
        add: function (val) {
            add(val);
            reset();
        },
        
        remove: function (val) {
            remove(val);
            reset();
        }
    };
    

    return function (at, el) {
        attr = at;
        ele  = el;
        return attrList;
    };
}());
        