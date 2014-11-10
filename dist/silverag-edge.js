/*
 * Build Date: Sunday, November 9th, 2014, 10:26:24 PM
 *
 * Silver Ag v0.5.0
 * https://github.com/markwise/silverag
 *
 * Copyright (c) 2014 Mark Wise, contributers
 * Released under the terms of the MIT license
 */

var silverag = (function () {
    'use strict';
    
    var version = '0.5.0';
    
    var win  = window;
    var doc  = document;
    var html = doc.documentElement;
    var head = doc.head;


    //
    // @module
    //
    // A simple interface to manipulate an element's attributes
    //
    
    var attr = (function () {
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


    //
    // @module
    //
    
    var generateAgId = (function () {
        var index = 0;
        
        //
        // @public
        //
        // Generates a universally unique identifier (UUID) for an ag element
        //
        // @params {HTMLElement} ele
        //      An ag element
        //
        // @returns {Number}
        //      Generated UUID
        //
        
        return function (ele) {
            //jshint -W093
            return ele.agid = new Date().getTime() + (index += 1);
        };
    }());


    //
    // @module
    //
    // Manages a layout's key/value store
    //
    
    var keyStore = (function () {
        var store = {};
    
        //
        // @public
        //
        // Creates a new key/value store for a layout by {agid}
        //
        // @params {String} agid
        //      The UUID associated with a layout
        //
        
        var create = function (agid) {
            //jshint -W093
            return store[agid] = {};
        };
        
        
        //
        // @public
        //
        // Removes a layouts key/value store from memory when a layout is removed
        // from the DOM
        //
        // @params {String} agid
        //      The UUID associated with a layout
        //
        
        var remove = function (agid) {
            store[agid] = null;
        };
        
        
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
        
        var get = function (agid) {
            return store[agid];
        };
    
    
        return {
            create: create,
            remove: remove,
            get: get
        };
    }());


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
        return doc.querySelectorAll(selector || '[ag]');
    };


    //
    // @module
    //
    
    var layout = (function () {
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


    //
    // @module
    //
    // A pass through module that iterates through a collection of layouts calling 
    // matching methods in the layout module
    //
    
    var layouts = (function () {
        //
        // @private
        //
        // A generic delegation function that iterates through a NodeList calling
        // {fn} for each item in {eles} with node as its argument
        //
        // @param {Function} fn
        //      The matching method in the layout module to call on each iteration
        //
        // @param {NodeList|undefined} eles
        //      A collection of layouts to iterate through
        //
        
        var delegate = function (fn, eles) {
            eles || (eles = getLayouts());
            
            var i = eles.length;
            
            while (i--) {
                fn(eles[i]);
            }
        };
        
        
        //
        // @public
        //
        // Initializes a list of layouts
        //
        // @param {NodeList} eles
        //      An optional list of layouts to initialize
        //
        
        var initialize = function (eles) {
            delegate(layout.initialize, eles);
        };
        
        
        //
        // @public
        //
        // Removes ag modifiers from a list of layouts
        //
        // @param {NodeList} eles
        //      An optional list of layouts to remove ag modifiers from
        //
    
        var removeModifiers = function (eles) {
            delegate(layout.removeModifiers, eles);
        };
        
        
        //
        // @public
        //
        // Reapplies ag modifiers to a list of layouts
        //
        // @param {NodeList} eles
        //      An optional list of layouts to reapply ag modifiers to
        //
        
        var applyModifiers = function (eles) {
            delegate(layout.applyModifiers, eles);
        };
        
        
        return {
            initialize: initialize,
            removeModifiers: removeModifiers,
            applyModifiers: applyModifiers
        };
    }());


    //
    // @module
    //
    // Uses MutationObservers to observe when new elements have been added and
    // removed from the DOM. This allows layouts to be initialized and cleaned up
    // when they are created and destroyed. IE10 uses MutationEvents as a fallback.
    // See the MutationObserver and MutationEvents APIs for details.
    //
    
    var layoutObserver = (function () {
        //
        // @private
        //
        // Nullifies a removed layout's keyStore object
        //      
        
        var removedNodesMutation = function (ele) {
            
            //Is ele a layout
            if (attr('class', ele).has('ag')) {
                keyStore.remove(ele.agid);
            }
            
            //Are any of ele's descendants a layout
            var eles = ele.querySelectorAll('.ag'),
                i = eles.length;
            
            while (i--) {
                keyStore.remove(eles[i].agid);
            }
        };
        
        
        //
        // @private
        //
        // MutationObserver callback
        //
        
        var mutationCallback = function (records) {
            var i = records.length,
                removedNodes,
                j;
            
            while (i--) {
                removedNodes = records[i].removedNodes;
                j = removedNodes.length;
        
                while (j--) {
                    removedNodesMutation(removedNodes[j]);
                }
            }
            
            //Try to initialize new layouts that have been added to the DOM
            layouts.initialize(getLayouts('[ag]:not(.ag)'));
        };
        
        
        //
        // @private
        //
        // MutationEvent listener for IE10
        //
        
        var mutationListener = function (event) {
            var type = event.type,
                target = event.target;
            
            //DOMNodeInserted is fired for parent nodes and their descendants that
            //are added to the DOM
            if (type === 'DOMNodeInserted') {
                if (attr('ag', target).has()) {
                    layout.initialize(target);
                }
            
            //DOMNodeRemoved only fires for parent nodes that are removed from the
            //DOM, but not their descendants unlike DOMNodeInserted
            } else
            if (type === 'DOMNodeRemoved') {
                removedNodesMutation(target);
            }
        };
    
        
        //
        // @public
        //
        // Creates a MutationObserver instance to observe when new elements have been 
        // added and removed from the DOM. IE10 uses MutationEvents as a fallback.
        //
        
        var create = function () {
            var mutationObserver = win.MutationObserver || win.WebKitMutationObserver;
            
            if (mutationObserver) {
                //jshint -W055
                new mutationObserver(mutationCallback).observe(doc.body, {
                    childList : true,
                    subtree : true
                });
                
            //IE10
            } else
            if (win.MutationEvent) {
                doc.body.addEventListener('DOMNodeInserted', mutationListener);
                doc.body.addEventListener('DOMNodeRemoved', mutationListener);
            }
            
            //Clean up
            layoutObserver = create = null;
        };
    
    
        return {
            create: create
        };
    }());


    //
    // @module
    //
    // Registers media queries using the matchMedia API. This is used in favor of
    // media queries written in CSS because it's less verbose. Otherwise, a media
    // query would have to be written for each max-width value we want a layout to
    // respond to. See the matchMedia API for details.
    //
    
    var mediaQueries = (function () {
        //
        // @private
        //
        // A Listener registered with matchMedia
        //
        // @param {MediaQueryList} mql
        //      A MediaQueryList object passed to the listener
        //
        
        var maxWidthChange = function (mql) {
            var maxWidth = mql.media.match(/(\d+)/)[1],
                eles = getLayouts('[ag-respond="' + maxWidth + '"]');
        
            if (eles.length) {
                if (mql.matches) {
                    layouts.removeModifiers(eles);
                } else {
                    layouts.applyModifiers(eles);
                }
            }
        };
        
        
        //
        // @public
        //
        // Create media queries from 480 to 960 in increments of 20 that listen for
        // changes in max-width
        //
        
        var create = function () {
            var media, i;
        
            for (i = 480; i <= 960; i += 20) {
                media = 'screen and (max-width:' + i + 'px)';
                matchMedia(media).addListener(maxWidthChange);
            }
            
            //Clean up
            mediaQueries = create = null;
        };
        
        
        return {
            create: create
        };
    }());


    //
    // @Closure
    //
    // Initializes silverag
    //
    
    (function () {
        var timer;
        
        //
        // Recursively trys to initialize layouts until the DOM is ready. This
        // provides fast initialization that checks elements as they become 
        // available instead of waiting for all elements to be ready.
        //
        
        var init = function () {
            timer = setTimeout(function () {
                layouts.initialize();
                init();
            });
        };
        
        init();
        
        
        //
        // DOMContentLoaded listener
        //
        
        var domReady = function () {
            //Stop timer to prevent further recursion
            clearTimeout(timer);
            
            //One final attempt to initialize layouts that may have been missed
            layouts.initialize();
            
            //Initialize media queries using the matchMedia API
            mediaQueries.create();
            
            //Initialize new layouts that have been added to the DOM
            layoutObserver.create();
            
            //Clean up
            doc.removeEventListener('DOMContentLoaded', domReady);
            timer = init = null;
        };
        
        doc.addEventListener('DOMContentLoaded', domReady);
    }());


    return {
        version: version
    };
}());