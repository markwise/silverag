
//requires: class_list

var layout = (function () {
    
    var createSignatureList = function (ele) {
        var match,
            klass = ele.className,
            list = ele.cel.signatureList = [],
            keys = [
                'flip',
                'align:[tmb]',
                'space:\\d',
                'split(?::\\d(?:\\/\\d)?)?'
            ],
            i = keys.length - 1;
        
        do {
            match = klass.match(new RegExp('(?:^|\\s+)(' + keys[i] + ')(?:\\s+|$)'));
            if (match) {
                list.push(match[1]);
            }
        } while (i--);
        
        //The class ns-1 is an internal code that means a responsive layout is 
        //ready. The presence of this class removes styles that are used during 
        //page load through negation, i.e., :not(.ns-1).
        classList.add('ns-1', ele);
        
        return list;
    };
    
    
    var getSignatureList = function (ele) {
        var store = ele.cel || (ele.cel = {});
        return store.signatureList || createSignatureList(ele);
    };
    
    
    var removeSignature = function (ele) {
        var a = getSignatureList(ele),
            i = a.length;
        
        while (i--) {
            classList.remove(a[i], ele);
        }
    };
    
    
    var applySignature = function (ele) {
        var a = getSignatureList(ele),
            i = a.length;
        
        while (i--) {
            classList.add(a[i], ele);
        }
    };
    
    
    return {
        removeSignature: removeSignature,
        applySignature: applySignature
    };
}());
