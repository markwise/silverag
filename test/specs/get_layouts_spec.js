/* global getLayouts */

describe('getLayouts', function () {

    beforeEach(function () {
        setFixtures([
            '<div class="ag-split"></div>',
            '<div class="ag-split:2"></div>',
            '<div class="ag-split:2/3"></div>'
        ].join(''));
    });
    
    it('should return all layouts', function () {
        expect(getLayouts().length).toBe(3);
    });
});