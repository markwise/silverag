/* global keyStore */

describe('keyStore', function () {
    var store, ag;

    beforeEach(function () {
        store = keyStore.create('ag');
        ag = keyStore.get('ag');
    });
    
    afterEach(function () {
        store = ag = void 0;
    });

    it('should create and return a keyStore object', function () {
        expect(store).toEqual(jasmine.any(Object));
    });
    
    it('should get a keyStore object', function () {
        expect(ag).toEqual(jasmine.any(Object));
        expect(store).toBe(ag);
    });
    
    it('should remove a keyStore object', function () {
        expect(ag).toEqual(jasmine.any(Object));
        keyStore.remove('ag');
        expect(keyStore.get('ag')).toBe(null);
    });
});