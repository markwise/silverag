/* global doc, attr, matchMedia, generateAgId, keyStore */

//
// @module
//

var layout = (function () {
    'use strict';

    //
    // @private
    //
    // Respond gets called one-time during layout initialization if a max-width
    // value is defined with the ag-res label.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @param {String} maxWidth
    //      The max-width value used to match against
    //

    var respond = function (ele, maxWidth) {
        var media = 'screen and (max-width:' + maxWidth + 'px)';

        if (matchMedia(media).matches) {
            removeModifiers(ele);
        } else {
            applyModifiers(ele);
        }
    };
    

    //
    // @private
    //
    // Returns a filtered array of ag-cel elements without the show modifier
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @returns {Array}
    //
    
    var getVisibleAgCels = function (ele) {
        var node = ele.firstElementChild,
            a = [];
            
        while (node) {
            if (!attr('ag-cel', node).has('show')) {
                a.push(node);
            }
        
            attr('class', node).add('ag-cel');
            node = node.nextElementSibling;
        }
    
        return a;
    };
    
    
    //
    // @private
    //
    // Creates an ag-line element between visible elements. Visible elements
    // are any ag-cel elements that don't have a show modifier, which is
    // used to hide ag-cel elements in non-responsive layouts. 
    //
    // Each ag-line element is assigned an ordinal value in relation to 
    // other ag-line elements. This ordinal value is used as an internal styling
    // hook to show and hide ag-line elements.
    //
    // Each ag-line element is also assigned the class ag-line that can be used
    // as an author styling hook
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    
    var createAgLines = function (ele) {
        var nodes = getVisibleAgCels(ele),
            l = nodes.length,
            i = 1,
            agLine;
        
        for (; i < l; i++) {
            agLine = doc.createElement('div');
            attr('ag-line', agLine).set(i);
            attr('class', agLine).add('ag-line');
            ele.insertBefore(agLine, nodes[i]);
        }
    };
    
    
    //
    // @private
    //
    // Removes non-element nodes from a layout. Although not required, it
    // provides a clean base to work from by eliminating comments and extraneous
    // whitespace nodes.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var removeNonElements = function (ele) {
        var node = ele.firstChild,
            next;

        while (node) {
            next = node.nextSibling;

            if (node.nodeType !== 1) {
                ele.removeChild(node);
            }

            node = next;
        }
    };


    //
    // @public
    //
    // Restores the ag label and it's modifiers to a layout.
    //
    // The class ag-not-responding is added to a layout providing a styling hook
    // for authors. Likewise, if a layout is responding, the class ag-responding 
    // is added to the layout.
    //
    // The methods applyModifiers and removeModifiers only apply to responsive
    // layouts defined with an ag-res label.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var applyModifiers = function (ele) {
        var store = keyStore.get(ele.agid);

        store.responding = false;
        attr('class', ele).remove('ag-responding');
        attr('class', ele).add('ag-not-responding');
        attr('ag', ele).set(store.modifiers);
    };


    //
    // @public
    //
    // Removes the ag label and it's modifiers from a layout. Because all styles
    // are tied to the attribute ag, removing it provides a clean style 
    // definition to work from when a layout is responding :)
    //
    // The class ag-responding is added to the layout providing a styling hook 
    // for authors. Likewise, if a layout is not responding, the class 
    // ag-not-responding is added to the layout.
    //
    // The methods applyModifiers and removeModifiers only apply to responsive
    // layouts defined with an ag-res label.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var removeModifiers = function (ele) {
        var store = keyStore.get(ele.agid);

        store.responding = true;
        attr('class', ele).remove('ag-not-responding');
        attr('class', ele).add('ag-responding');
        attr('ag', ele).remove();
    };


    //
    // @public
    //
    // The core layout initialization method
    //
    // What does it mean for a layout to be initialized?
    //
    // 1. A UUID is created for a layout, which is used to create a 
    //    key/value store
    //
    // 2. All non-element nodes are removed from a layout to provide a clean
    //    base to work from
    //
    // 3. ag-line elements are injected into a layout, which are used to show
    //    and hide dividing lines between columns
    //
    // 4. If a layout is responsive, meaning it has an ag-res label, the
    //    max-width value of ag-res is used to match a media query defined 
    //    using the matchMedia API to initialize a layout accordingly
    //
    // 5. The layout is made visible by adding the class ag
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var initialize = function (ele) {
        
        //Make sure we only initialize a layout once
        if (ele.agid !== void 0) {
            return;
        }
        
        var store = keyStore.create(generateAgId(ele)),
            agRes = attr('ag-res', ele).get();
         
        store.modifiers = attr('ag', ele).get();
        removeNonElements(ele);
        createAgLines(ele);
        
        if (agRes) {
            respond(ele, agRes);
        }
        
        attr('class', ele).add('ag');
    };


    return {
        initialize: initialize,
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers
    };
}());
