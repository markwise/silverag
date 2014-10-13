/* global
win,
doc,
supportsMediaQueries,
attr,
matchMedia,
generateAgId,
keyStore,
styleSheet
*/

//
// @module
//
// Handles all operations related to an ag layout element
//

var layout = (function () {
    'use strict';
    
    //
    // @private
    //
    // Returns the largest offsetHeight value of all visible elements
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @returns {String}
    //      The min-height value with a px unit
    //

    var getMinHeightIE8 = function (ele) {
        var a = [];

        forEachVisibleElement(ele, function (node) {
            a.push(node.offsetHeight);
        });

        return Math.max.apply(null, a) + 'px';
    };


    //
    // @private
    //
    // Returns the height of an ag element that will be used as the min-height
    // value for all ag-cel and ag-line elements
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @returns {String}
    //      The min-height value with a px unit
    //

    var getMinHeight = function (ele) {
        var style = win.getComputedStyle;

        return style ? style(ele, null).height : getMinHeightIE8(ele);
    };


    //
    // @private
    //
    // Creates and returns an ag-line element
    //
    // @params {Number} index
    //      The index of the line in relation to other lines in a layout. This
    //      index is used as a styling hook to show and hide ag-line elements.
    //
    // @returns {HTMLElement}
    //      An ag-line element
    //

    var createLine = function (index) {
        var fragment = doc.createDocumentFragment(),
            line = doc.createElement('div');

        attr('ag-line', line).set(index);
        //Safari requires a tab character
        fragment.appendChild(doc.createTextNode('\u0009'));
        fragment.appendChild(line);
        fragment.appendChild(doc.createTextNode('\u0009'));

        return fragment;
    };


    //
    // @private
    //
    // Iterates over all child element nodes in {ele} calling {fn} for each
    // child element. When {fn} is called, it will be passed the current
    // element in the iteration and a index value. The index starts at 1 and
    // is the order in relation to other siblings not the DOM index value.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @param {Function} fn
    //      Callback function that will be passed the current element in the
    //      iteration and a index value
    //

    var forEachElement = function (ele, fn) {
        var node = ele.firstElementChild,
            index = 1;

        if (node) {
            while (node) {
                fn(node, index);
                node = node.nextElementSibling;
                index += 1;
            }

        //IE8
        } else {
            node = ele.firstChild;

            while (node) {
                if (node.canHaveChildren) {
                    fn(node, index);
                    index += 1;
                }

                node = node.nextSibling;
            }
        }
    };


    //
    // @private
    //
    // A pass through call to forEachElement to filter visible elements. This
    // will exclude ag-cel elements that have the modifer show, which sets
    // an element's display to none.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @param {Function} fn
    //      Callback function that will be passed the current element in the
    //      iteration and a index value
    //

    var forEachVisibleElement = function (ele, fn) {
        var index = 1;

        forEachElement(ele, function (node) {
            if (!attr('ag-cel', node).has('show')) {
                fn(node, index);
                index += 1;
            }
        });
    };


    //
    // @private
    //
    // Respond gets called once during initialization if a layout has a 
    // max-width value defined with an ag-res directive
    //
    // @param {HTMLElement} ele
    //      An ag element
    //
    // @param {String} maxWidth
    //      The max-width value use to match against
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
    // Creates ag-line elements
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var createLines = function (ele) {
        forEachVisibleElement(ele, function (node, index) {
            if (index > 1) {
                ele.insertBefore(createLine(index - 1), node);
            }
        });
    };


    //
    // @private
    //
    // As the name implies, all whitespace nodes are removed from an ag element
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var removeWhitespace = function (ele) {
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
    // @private
    //
    // Does the ag directive contain a flip modifier
    //
    // @param {String} modifiers
    //      An ag directives modifiers
    //
    // @returns {Boolen}
    //      True or false if the modifier exists
    //

    var hasFlipModifier = function (modifiers) {
        return /(?:^|\s+)flip(?:\s+|$)/.test(modifiers);
    };


    //
    // @private
    //
    // Does the ag directive contain a lines modifier
    //
    // @param {String} modifiers
    //      An ag directives modifiers
    //
    // @returns {Boolen}
    //      True or false if the modifier exists
    //

    var hasLinesModifier = function (modifiers) {
        return /(?:^|\s+)lines(?::(?:show|hide):\d)?(?:\s+|$)/.test(modifiers);
    };


    //
    // @private
    //
    // Does the ag directive contain a align modifier
    //
    // @param {String} modifiers
    //      An ag directives modifiers
    //
    // @returns {Boolen}
    //      True or false if the modifier exists
    //

    var hasAlignModifier = function (modifiers) {
        return /(?:^|\s+)align:[tmb](?:\s+|$)/.test(modifiers);
    };


    //
    // @private
    //
    // Does the ag directive contain a space modifier
    //
    // @param {String} modifiers
    //      An ag directives modifiers
    //
    // @returns {Boolen}
    //      True or false if the modifier exists
    //

    var hasSpaceModifier = function (modifiers) {
        return /(?:^|\s+)space:[12345](?:\s+|$)/.test(modifiers);
    };


    //
    // @private
    //
    // Does the ag directive contain a split modifier
    //
    // @param {String} modifiers
    //      An ag directives modifiers
    //
    // @returns {Boolen}
    //      True or false if the modifier exists
    //

    var hasSplitModifier = function (modifiers) {
        return /(?:^|\s+)split:(?:[2345]|[1]\/[23]|[23]\/1|2\/3|3\/2)(?:\s+|$)/.test(modifiers);
    };


    //
    // @public
    //
    // Sets the min-height for all ag-cel and ag-line elements. If the align
    // modifier exists, only ag-line elements get a min-height value set.
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var resizeMinHeight = function (ele) {
        var agid = ele.agid,
            store = keyStore.get(agid),
            styles;

        //Sets the min-height value to 0 for all ag-cel and ag-line elements
        //while a new min-height value is being calculated
        attr('ag-reflow', ele).set();

        styles = [
            '[ag-id="', agid, '"] > [ag-line] {\n',
                //jshint -W015
                '\tmin-height: ', getMinHeight(ele), ';\n',
            '}'
        ].join('');

        //Only include ag-cel elements if the align modifier is not present
        if (!store.hasAlignModifier) {
            styles = ['[ag-id="', agid, '"] > [ag-cel],\n', styles].join('');
        }

        styleSheet.set(agid, styles);
        attr('ag-reflow', ele).remove();
    };


    //
    // @public
    //
    // Restores the ag directive and stored modifiers back to a layout
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
    // Removes the ag directive and all modifiers from a layout
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var removeModifiers = function (ele) {
        var agid = ele.agid,
            store = keyStore.get(agid);

        store.responding = true;
        attr('class', ele).remove('ag-not-responding');
        attr('class', ele).add('ag-responding');
        attr('ag', ele).remove();
        styleSheet.clear(agid);
    };


    //
    // @public
    //
    // The core layout initialization method. This is where all the good stuff
    // happens
    //
    // @param {HTMLElement} ele
    //      An ag element
    //

    var initialize = function (ele) {

        if (ele.agid !== void 0) {
            return;
        }

        var agid = generateAgId(ele),
            store = keyStore.create(agid),
            modifiers,
            maxWidth;
        
        //Cache layout data
        store.modifiers = modifiers = attr('ag', ele).get();
        store.hasSplitModifier = hasSplitModifier(modifiers);
        store.hasSpaceModifier = hasSpaceModifier(modifiers);
        store.hasAlignModifier = hasAlignModifier(modifiers);
        store.hasLinesModifier = hasLinesModifier(modifiers);
        store.hasFlipModifier = hasFlipModifier(modifiers);
        store.maxWidth = maxWidth = attr('ag-res', ele).get();
        
        //Create a layout stylesheet
        styleSheet.create(agid);
        
        //Remove all whitespace nodes from a layout 
        removeWhitespace(ele);
        
        //Add lines that are used for vertical alignment and can be made
        //visible with the lines directive
        createLines(ele);
        
        //Not IE8 and a max-width value is defined with the ag-res directive
        if (supportsMediaQueries && maxWidth) {
            respond(ele, maxWidth);
        }
        
        //Initialize the height of ag-line and ag-cel elements if a layout
        //is not responding
        if (!store.responding) {
            resizeMinHeight(ele);
        }
        
        //The layout is ready to be made visible
        attr('ag-ready', ele).set();
    };


    return {
        initialize: initialize,
        removeModifiers: removeModifiers,
        applyModifiers: applyModifiers,
        resizeMinHeight: resizeMinHeight
    };
}());
