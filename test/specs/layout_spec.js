/* global layout */

describe('layout', function () {
    
    beforeEach(function () {
        /* jshint -W015 */
        
        setFixtures([
            '<div id="test"  class="ag-split:2 ag-space:2 ag-align:t ag-flip"></div>',
            '<div id="test1" class="ag-split"></div>',
            '<div id="test2" class="ag-split:2" >',
                '<div class="ag-line"></div>',
            '</div>',
            '<div id="test3" class="ag-split:2/3">',
                '<div class="ag-line"></div>',
            '</div>',
            '<div id="test4" class="ag-split:3">',
                '<div class="ag-line"></div>',
            '</div>',
            '<div id="test5" class="ag-split:4">',
                '<div class="ag-line"></div>',
            '</div>',
            '<div id="test6" class="ag-split:5">',
                '<div class="ag-line"></div>',
            '</div>'
        ].join(''));
    });


    it('should create data store ag', function () {
        var test = $('#test1');
        expect(test).not.toHaveProp('ag');
        layout.initialize(test[0]);
        expect(test).toHaveProp('ag');
    });

    
    it('ag.responding should be defined', function () {
        var test  = $('#test1');
        layout.initialize(test[0]);
        expect(test.prop('ag').responding).toBeDefined();
    });

    
    it('ag.lines should be false', function () {
        var test = $('#test1');
        layout.initialize(test[0]);
        expect(test.prop('ag').lines).toBe(false);
    });

    
    it('ag.lines should be true', function () {
        var test = $('#test2');
        layout.initialize(test[0]);
        expect(test.prop('ag').lines).toBe(true);
    });


    it('ag.maxColsPerRow should be undefined', function () {
        var test = $('#test1');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBeUndefined();
    });

    
    it('ag.maxColsPerRow should be 2', function () {
        var test = $('#test2');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBe(2);
        
        test = $('#test3');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBe(2);
    });


    it('ag.maxColsPerRow should be 3', function () {
        var test = $('#test4');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBe(3);
    });
    
    
    it('ag.maxColsPerRow should be 4', function () {
        var test = $('#test5');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBe(4);
    });
    
    
    it('ag.maxColsPerRow should be 5', function () {
        var test = $('#test6');
        layout.initialize(test[0]);
        expect(test.prop('ag').maxColsPerRow).toBe(5);
    });
    
    
    it('should have class ag-ready', function () {
        var test = $('#test1');
        expect(test).not.toHaveClass('ag-ready');
        layout.initialize(test[0]);
        expect(test).toHaveClass('ag-ready');
    });
    
    
    it('ag.ready should be true', function () {
        var test = $('#test1');
        layout.initialize(test[0]);
        expect(test.prop('ag').ready).toBe(true);
    });
    
    
    it('ag.modifiers should be defined', function () {
        var test = $('#test');
        layout.initialize(test[0]);
        layout.removeModifiers(test[0]);
        expect(test.prop('ag').modifiers).toBeDefined();
    });


    it('should remove ag.modifiers', function () {
        var test = $('#test');
        layout.initialize(test[0]);
        expect(test).toHaveClass('ag-split:2');
        expect(test).toHaveClass('ag-space:2');
        expect(test).toHaveClass('ag-align:t');
        expect(test).toHaveClass('ag-flip');
        layout.removeModifiers(test[0]);
        expect(test).not.toHaveClass('ag-split:2');
        expect(test).not.toHaveClass('ag-space:2');
        expect(test).not.toHaveClass('ag-align:t');
        expect(test).not.toHaveClass('ag-flip');
    });


    it('should apply ag.modifiers', function () {
        var test = $('#test');
        layout.initialize(test[0]);
        layout.removeModifiers(test[0]);
        layout.applyModifiers(test[0]);
        expect(test).toHaveClass('ag-split:2');
        expect(test).toHaveClass('ag-space:2');
        expect(test).toHaveClass('ag-align:t');
        expect(test).toHaveClass('ag-flip');
    });
});
