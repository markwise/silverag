/* global layout, keyStore */

describe('layout', function () {
    var $ele, ele;

    beforeEach(function () {
        setFixtures([
            //jshint ignore:start
            '<div ag="split:3">',
                '<div ag-item></div>',
                '<div ag-item="show"></div>',
                '<div ag-item></div>',
                '<div ag-item="show"></div>',
                '<div ag-item></div>',
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
        var store,
            agItem = $ele.children('[ag-item]')[0],
            agLines;
        
        expect($ele).not.toHaveProp('agid');
        expect(keyStore.get(ele.agid)).not.toEqual(jasmine.any(Object));
        expect($ele.children('[ag-line]').length).toBe(0);
        expect($ele).not.toHaveClass('ag');
        expect(agItem).not.toHaveClass('ag-item');
        
        layout.initialize(ele);
        expect($ele).toHaveProp('agid');
        store = keyStore.get(ele.agid);
        expect(store).toEqual(jasmine.any(Object));
        expect(store.modifiers).toBe('split:3');
        agLines = $ele.children('[ag-line]');
        expect(agLines.length).toBe(2);
        expect($ele).toHaveClass('ag');
        expect(agItem).toHaveClass('ag-item');
        expect(agLines[0]).toHaveClass('ag-line');
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