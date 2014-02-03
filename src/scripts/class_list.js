var classList = (function () {

    var trim = (function () {
        if (String.prototype.trim) {
            return function (str) {
                return str.trim();
            };
        } else {
            return function (str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
        }
    }());


    var getClassList = function (ele) {
        var s = trim(ele.className); 
        return s.length ? s.split(/\s+/) : [];
    };


    var contains = (function () {
        if (typeof DOMTokenList !== 'undefined') {
            return function (klass, ele) {
                return ele.classList.contains(klass);
            };
        } else {
            return function (klass, ele) {
                var a = getClassList(ele),
                    i = a.length;

                while (i--) {
                    if (klass === a[i]) {
                        return true;
                    }
                }

                return false;
            };
        }
    }());
    
        
    var add = (function () {
        if (typeof DOMTokenList !== 'undefined') {
            return function (klass, ele) {
                ele.classList.add(klass);
            };
        } else {
            return function (klass, ele) {
                var a;
            
                if (contains(klass, ele)) {
                    return;
                }
                
                a = getClassList(ele);
                a.push(klass);
                ele.className = a.join(' ');
            };
        }
    }());
    

    var remove = (function () {
        if (typeof DOMTokenList !== 'undefined') {
            return function (klass, ele) {
                ele.classList.remove(klass);
            };
        } else {
            return function (klass, ele) {
                var a = getClassList(ele),
                    i = a.length;

                while (i--) {
                    if (klass === a[i]) {
                        a.splice(i, 1);
                        break;
                    }
                }

                ele.className = a.join(' ');
            };
        }
    }());
    
    
    return {
        contains : contains,
        add : add,
        remove : remove
    };
}());
        