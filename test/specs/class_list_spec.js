/* global classList */

describe('classList', function () {
    
    beforeEach(function () {
        setFixtures([
            '<div id="test1"></div>',
            '<div id="test2" class="ag-split:1/2 ag-space:2 ag-align:m ag-flip"></div>'
        ].join(''));
    });
    
    
    it('should return false if a class does not exist', function () {
        var test = $('#test1')[0];
        expect(classList.contains('ag-split:1/2', test)).toBe(false);
        expect(classList.contains('ag-space:2', test)).toBe(false);
        expect(classList.contains('ag-align:m', test)).toBe(false);
        expect(classList.contains('ag-flip', test)).toBe(false);
    });
    
    
    it('should return true if a class exists', function () {
        var test = $('#test2')[0];
        expect(classList.contains('ag-split:1/2', test)).toBe(true);
        expect(classList.contains('ag-space:2', test)).toBe(true);
        expect(classList.contains('ag-align:m', test)).toBe(true);
        expect(classList.contains('ag-flip', test)).toBe(true);
    });
    
    
    it('should add a class', function () {
        var test = $('#test1');
        expect(test).not.toHaveClass('ag-split:1/2');
        expect(test).not.toHaveClass('ag-space:2');
        expect(test).not.toHaveClass('ag-align:m');
        expect(test).not.toHaveClass('ag-flip');
        
        classList.add('ag-split:1/2', test[0]);
        classList.add('ag-space:2', test[0]);
        classList.add('ag-align:m', test[0]);
        classList.add('ag-flip', test[0]);
        
        expect(test).toHaveClass('ag-split:1/2');
        expect(test).toHaveClass('ag-space:2');
        expect(test).toHaveClass('ag-align:m');
        expect(test).toHaveClass('ag-flip');
    });
    
    
    it('should remove a class', function () {
        var test = $('#test2');
        expect(test).toHaveClass('ag-split:1/2');
        classList.remove('ag-split:1/2', test[0]);
        expect(test).not.toHaveClass('ag-split:1/2');
        
        expect(test).toHaveClass('ag-space:2');
        classList.remove('ag-space:2', test[0]);
        expect(test).not.toHaveClass('ag-space:2');
        
        expect(test).toHaveClass('ag-align:m');
        classList.remove('ag-align:m', test[0]);
        expect(test).not.toHaveClass('ag-align:m');
        
        expect(test).toHaveClass('ag-flip');
        classList.remove('ag-flip', test[0]);
        expect(test).not.toHaveClass('ag-flip');
    });
});
