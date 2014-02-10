/* global layout */

describe('layout', function () {

    describe('layout signature', function () {
        var test;
        
        beforeEach(function () {
            setFixtures([
                '<div id="test" class="ag-split:2 ag-space:2 ag-align:t ag-flip"></div>'
            ].join(''));
            
            test = $('#test');
        });
        
        afterEach(function () {
            test = null;
        });
        
        
        it('should create data store ag', function () {
            expect(test.prop('ag')).not.toBeDefined();
            layout.removeSignature(test[0]);
            expect(test.prop('ag')).toBeDefined();
        });
        
        
        it('should have property ag.signatureList', function () {
            layout.removeSignature(test[0]);
            expect(test.prop('ag').signatureList).toBeDefined();
        });
        
        
        it('should add class ag-1 to layout', function () {
            expect(test).not.toHaveClass('ag-1');
            layout.removeSignature(test[0]);
            expect(test).toHaveClass('ag-1');
        });
    
    
        it('should remove layout signature', function () {
            expect(test).toHaveClass('ag-split:2');
            expect(test).toHaveClass('ag-space:2');
            expect(test).toHaveClass('ag-align:t');
            expect(test).toHaveClass('ag-flip');
            layout.removeSignature(test[0]);
            expect(test).not.toHaveClass('ag-split:2');
            expect(test).not.toHaveClass('ag-space:2');
            expect(test).not.toHaveClass('ag-align:t');
            expect(test).not.toHaveClass('ag-flip');
        });
    
    
        it('should apply layout signature', function () {
            layout.removeSignature(test[0]);
            layout.applySignature(test[0]);
            expect(test).toHaveClass('ag-split:2');
            expect(test).toHaveClass('ag-space:2');
            expect(test).toHaveClass('ag-align:t');
            expect(test).toHaveClass('ag-flip');
        });
    });

    
    describe('layout initialization', function () {
    
        beforeEach(function () {
            /* jshint -W015 */
            
            setFixtures([
                '<div class="ag-split" id="test1"></div>',
                '<div class="ag-split:2" id="test2">',
                    '<div class="ag-line"></div>',
                '</div>',
                '<div class="ag-split:2/3" id="test3">',
                    '<div class="ag-line"></div>',
                '</div>',
                '<div class="ag-split:3" id="test4">',
                    '<div class="ag-line"></div>',
                '</div>',
                '<div class="ag-split:4" id="test5">',
                    '<div class="ag-line"></div>',
                '</div>',
                '<div class="ag-split:5" id="test6">',
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
    
    
        it('should have property ag.hasLines', function () {
            var test  = $('#test1');
            layout.initialize(test[0]);
            expect(test.prop('ag').hasLines).toBeDefined();
        });
    
        
        it('ag.hasLines should be false', function () {
            var test = $('#test1');
            layout.initialize(test[0]);
            expect(test.prop('ag').hasLines).toBe(false);
        });
    
        
        it('ag.hasLines should be true', function () {
            var test = $('#test2');
            layout.initialize(test[0]);
            expect(test.prop('ag').hasLines).toBe(true);
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
    });
});
