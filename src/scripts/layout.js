/* global doc, attr, matchMedia, generateAgId, keyStore */

//
// @module
//

var layout = (function () {
    'use strict';

    //
    // @private
    //
    // Respond gets called one-time during initialization to check if a layout 
    // should be responding or not.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var respond = function (ele) {
        var maxWidth = attr('ag-respond', ele).get(),
            media = 'screen and (max-width:' + maxWidth + 'px)';
    
        if (matchMedia(media).matches) {
            removeModifiers(ele);
        } else {
            applyModifiers(ele);
        }
    };
    

    //
    // @private
    //
    // Returns a filtered array of ag-item elements that don't have a show modifier.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @returns {Array}
    //
    
    var getVisibleAgItems = function (ele) {
        var node = ele.firstElementChild,
            a = [];
            
        while (node) {
            if (!attr('ag-item', node).has('show')) {
                a.push(node);
            }
        
            attr('class', node).add('ag-item');
            node = node.nextElementSibling;
        }
    
        return a;
    };
    
    
    //
    // @private
    //
    // Creates an ag-line element between visible elements. Visible elements
    // are any ag-item elements that don't have a show modifier, which is
    // used to hide ag-item elements in non-responsive layouts. 
    //
    // Each ag-line element is assigned an ordinal value in relation to 
    // other ag-line elements. This ordinal value is used as an internal styling
    // hook to show and hide ag-line elements.
    //
    // Each ag-line element is also assigned the class ag-line that can be used
    // as an author styling hook.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    
    var createAgLines = function (ele) {
        var nodes = getVisibleAgItems(ele),
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
    // @public
    //
    // Restores the ag label and it's modifiers to a layout.
    //
    // The class ag-not-responding is added to a layout providing a styling hook
    // for authors. Likewise, if a layout is responding, the class ag-responding 
    // is added to the layout.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var applyModifiers = function (ele) {
        var store = keyStore.get(ele.agid);
        
        attr('class', ele).remove('ag-responding');
        attr('class', ele).add('ag-not-responding');
        attr('ag', ele).set(store.modifiers);
    };


    //
    // @public
    //
    // Removes the ag label and it's modifiers from a layout. Because all styles
    // are tied to the attribute ag, removing it provides a clean style 
    // definition to work from when a layout is responding.
    //
    // The class ag-responding is added to the layout providing a styling hook 
    // for authors. Likewise, if a layout is not responding, the class 
    // ag-not-responding is added to the layout.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var removeModifiers = function (ele) {
        attr('class', ele).remove('ag-not-responding');
        attr('class', ele).add('ag-responding');
        attr('ag', ele).remove();
    };


    //
    // @public
    //
    // The core layout initialization method does the following:
    //
    // 1. A UUID is created for a layout and is used to create a 
    //    key/value store
    //
    // 2. ag-line elements are injected into a layout, which are used to show
    //    and hide dividing lines between columns
    //
    // 3. If a layout is responsive, meaning it has an ag-respond label, the
    //    max-width value of ag-respond is used to match a media query defined 
    //    using the matchMedia API to initialize a layout accordingly
    //
    // 4. The layout is made visible by adding the class ag
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var initialize = function (ele) {
        
        //Make sure we only initialize a layout once
        if (ele.agid !== void 0) {
            return;
        }
        
        var store = keyStore.create(generateAgId(ele));
         
        store.modifiers = attr('ag', ele).get();
        createAgLines(ele);
        respond(ele);
        attr('class', ele).add('ag');
    };


    return {
        initialize: initialize,
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers
    };
}());