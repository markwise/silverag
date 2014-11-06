/* global layout, keyStore */

describe('layout', function () {
    var $ele, ele;

    beforeEach(function () {
        setFixtures([
            //jshint ignore:start
            '<div ag="split:3">',
                '<div ag-cel></div>',
                '<div ag-cel="show"></div>',
                '<div ag-cel></div>',
                '<div ag-cel="show"></div>',
                '<div ag-cel></div>',
            '</div>'
            //jshint ignore:end
        ].join(''));
        
        $ele = $('[ag]');
        ele = $ele[0];
    });
    
    afterEach(function () {
        $ele = ele = void 0;
    });

    it('should initialize a layout', function () {
        var store;
        
        expect($ele).not.toHaveProp('agid');
        expect(keyStore.get(ele.agid)).not.toEqual(jasmine.any(Object));
        expect($ele.children('[ag-line]').length).toBe(0);
        expect($ele).not.toHaveClass('ag-ready');
        
        layout.initialize(ele);
        expect($ele).toHaveProp('agid');
        store = keyStore.get(ele.agid);
        expect(store).toEqual(jasmine.any(Object));
        expect(store.modifiers).toBe('split:3');
        expect($ele.children('[ag-line]').length).toBe(2);
        expect($ele).toHaveClass('ag-ready');
    });
    
    it('should remove modifiers', function () {
        var store;
    
        layout.initialize(ele);
        store = keyStore.get(ele.agid);
        expect(store.responding).toBeUndefined();
        expect($ele).not.toHaveClass('ag-responding');
        expect($ele).not.toHaveClass('ag-not-responding');
        expect($ele).toHaveAttr('ag');
        
        layout.removeModifiers(ele);
        expect(store.responding).toBe(true);
        expect($ele).toHaveClass('ag-responding');
        expect($ele).not.toHaveClass('ag-not-responding');
        expect($ele).not.toHaveAttr('ag');
    });
    
    it('should apply modifiers', function () {
        var store;
        
        layout.initialize(ele);
        store = keyStore.get(ele.agid);
        layout.removeModifiers(ele);
        expect(store.responding).toBe(true);
        expect($ele).toHaveClass('ag-responding');
        expect($ele).not.toHaveClass('ag-not-responding');
        expect($ele).not.toHaveAttr('ag');
        
        layout.applyModifiers(ele);
        expect(store.responding).toBe(false);
        expect($ele).toHaveClass('ag-not-responding');
        expect($ele).not.toHaveClass('ag-responding');
        expect($ele).toHaveAttr('ag', store.modifiers);
    });
});