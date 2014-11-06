/* global getLayouts, NodeList */

describe('getLayouts', function () {

    beforeEach(function () {
        setFixtures([
            '<div ag></div>',
            '<div ag class="ag-ready"></div>',
            '<div ag></div>',
            '<div ag class="ag-ready"></div>',
            '<div ag></div>'
        ].join(''));
    });
    
    it('should return a NodeList of all layouts', function () {
        expect(getLayouts()).toEqual(jasmine.any(NodeList));
        expect(getLayouts().length).toBe(5);
    });
    
    it('should accept a selector argument to filter layouts', function () {
        expect(getLayouts('.ag-ready').length).toBe(2);
    });
});