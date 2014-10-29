/* global
doc, 
head, 
supportsMediaQueries,
resize
*/

//
// @module
//
// Handles manipulation of stylesheets
//

var styleSheet = (function () {
    return {
    
        //
        // @public
        //
        // Creates a <style> element with an id corresponding to {agid} that
        // can be used to add and remove styles for an ag element
        //
        // @param {Number} agid
        //      The unique identifer for an ag element
        //
    
        create: function (agid) {
            var style = doc.createElement('style');
            style.id = 'ag-' + agid;
            head.appendChild(style);
        },
        
        
        //
        // @public
        //
        // Returns the <style> element corresponding to {agid}
        //
        // @param {Number} agid
        //      The unique identifer for an ag element
        //
        // @returns {HTMLElement}
        //      The <style> element corresponding to {agid}
        //
        
        get: function (agid) {
            return doc.querySelector('#ag-' + agid);
        },
        
        
        //
        // @public
        //
        // Adds styles to the <style> element corresponding to {agid}
        //
        // @param {Number} agid
        //      The unique identifer for an ag element
        //
        // @params {String} styles
        //      The new styles to be added
        //
        
        set: function (agid, styles) {
            var style = styleSheet.get(agid);

            style.innerHTML = styles;
        },
        
        
        //
        // @public
        //
        // Remove all styles from the <style> element corresponding to {agid}
        //
        // @param {Number} agid
        //      The unique identifer for an ag element
        //
        
        clear: function (agid) {
            styleSheet.set(agid, '');
        }
    };
}());
