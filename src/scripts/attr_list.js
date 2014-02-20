var attrList = (function () {
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
    
    
    var attribute = {
    
        get:  function (asArray) {
            var val = trim(ele.getAttribute(attr) || '');
            
            if (asArray !== void 0) {
                val = val.length ? val.split(/\s+/) : [];
            }
            
            return val;
        },
        
        
        set: function (val) {
            ele.setAttribute(attr, val || '');
        },
        
        
        has: function (val) {
            var a,
                b,
                i;
        
            if (ele.hasAttribute(attr)) {
        
                if (val !== void 0) {
                    a = [].indexOf ? this.get(true) : this.get();
                    b = val.split(/\s+/);
                    i = b.length;
                
                    while (i--) {
                        if (a.indexOf(b[i]) < 0) {
                            return false;
                        }
                    }
                }
                
                return true;
            }
    
            return false;
        },
        
        
        add: function (val) {
            
            if (!this.has()) {
                return;
            }
            
            var valueList = this.get(true),
                a,
                i,
                item;
                
            if (val !== void 0) {
                a = trim(val);
                
                if (a === '') {
                    return;
                }
                
                a = a.split(/\s+/);
                i = a.length;
                item;
                
                while (i--) {
                    item = a[i];
                    if (!this.has(item)) {
                        valueList.push(item);
                    }
                }
            }
            
            this.set(valueList.join(' '));
        },
        
    
        remove: function (val) {
        
            if (!this.has()) {
                return;
            }
        
            var valueList = this.get(true),
                a,
                i,
                j;
            
            if (val !== void 0) {
                a = trim(val);
                
                if (a === '') {
                    return;
                }
                
                a = a.split(/\s+/);
                i = a.length;
               
                while (i--) {
                    j = valueList.length;
                    
                    while (j--) {
                        if (valueList[j] === a[i]) {
                            valueList.splice(j, 1);
                        }
                    }
                }
                
                this.set(valueList.join(' '));
            } else {
                ele.removeAttribute(attr);
            }
        }
    };
    

    return function (at, el) {
        attr = at;
        ele = el;
        return attribute;
    };
}());
        