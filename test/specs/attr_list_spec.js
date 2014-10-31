/* global attr */

describe('attrList', function () {

    var $ele, ele;

    beforeEach(function () {
        setFixtures('<div id="test"></div>');
        $ele = $('#test');
        ele = $ele[0];
    });

    afterEach(function () {
        $ele = null;
        ele =  null;
    });


    //Core attrList object
    
    it('should return an attrList object', function () {
        expect(attr()).toEqual(jasmine.any(Object));
    });
    
    it('should have method get', function () {
        expect(attr().get).toEqual(jasmine.any(Function));
    });
    
    it('should have method set', function () {
        expect(attr().set).toEqual(jasmine.any(Function));
    });
    
    it('should have method has', function () {
        expect(attr().has).toEqual(jasmine.any(Function));
    });
    
    it('should have method add', function () {
        expect(attr().get).toEqual(jasmine.any(Function));
    });
    
    it('should have method remove', function () {
        expect(attr().get).toEqual(jasmine.any(Function));
    });
    
    
    //Set method
    
    describe('attrList.set', function () {
        
        it('should set an attribute', function () {
            expect($ele).not.toHaveAttr('ag');
            attr('ag', ele).set();
            expect($ele).toHaveAttr('ag');
        });
    
        it('should set an attribute\'s value', function () {
            expect($ele).not.toHaveAttr('ag', 'split:1/2');
            attr('ag', ele).set('split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
        });
    
        it('should overwrite an attribute\'s value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(ele).toHaveAttr('ag', 'split:1/2 space:5');
            
            attr('ag', ele).set('split:3/2 space:1');
            expect(ele).toHaveAttr('ag', 'split:3/2 space:1');
        });
    
        it('should clear an attribute\'s value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(ele).toHaveAttr('ag', 'split:1/2 space:5');
            
            attr('ag', ele).set();
            expect(ele).toHaveAttr('ag', '');
        });
    });
    
    
    //Get method
    
    describe('attrList.get', function () {
        
        it('should return an empty string', function () {
            attr('ag', ele).set();
            expect(attr('ag', ele).get()).toBe('');
        });
        
        it('should return an attribute\'s value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(attr('ag', ele).get()).toBe('split:1/2 space:5');
        });
    });
    
    
    //Has method
    
    describe('attrList.has', function () {
        
        it('should return true if the attribute exists', function () {
            attr('ag', ele).set();
            expect(attr('ag', ele).has()).toBe(true);
        });
        
        it('should return true if the attribute value exists', function () {
            attr('ag', ele).set('split:1/2 space:1 align:b flip');
            expect(attr('ag', ele).has('split:1/2')).toBe(true);
            expect(attr('ag', ele).has('space:1')).toBe(true);
            expect(attr('ag', ele).has('align:b')).toBe(true);
            expect(attr('ag', ele).has('flip')).toBe(true);
        });
        
        it('should return false if the attribute does not exist', function () {
            expect(attr('ag', ele).has()).toBe(false);
        });
        
        it('should return false if the attribute value does not exist', function () {
            attr('ag', ele).set('split:1/2 align:b');
            expect(attr('ag', ele).has('split:3/2')).toBe(false);
            expect(attr('ag', ele).has('align:m')).toBe(false);
            expect(attr('ag', ele).has('space:1')).toBe(false);
        });
    });
    
    
    //Add method
    
    describe('attrList.add', function () {
    
        it('should add an attribute', function () {
            expect($ele).not.toHaveAttr('ag');
            attr('ag', ele).add();
            expect($ele).toHaveAttr('ag');
        });
        
        it('should append a string to an attribute\'s value', function () {
            attr('ag', ele).add('split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
            
            attr('ag', ele).add('space:1');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1');
            
            attr('ag', ele).add('align:b');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1 align:b');
            
            attr('ag', ele).add('flip');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1 align:b flip');
        });
        
        it('should append a string to an attribute\'s value once', function () {
            attr('ag', ele).add('split:1/2');
            attr('ag', ele).add('split:1/2');
            attr('ag', ele).add('split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
        });
    });
    
    
    //Remove method
    
    describe('attrList.remove', function () {
        
        it('should remove an attribute', function () {
            attr('ag', ele).set();
            expect($ele).toHaveAttr('ag', '');
            
            attr('ag', ele).remove();
            expect($ele).not.toHaveAttr('ag');
        });
        
        it('should remove a string from an attribute\'s value', function () {
            attr('ag', ele).set('split:3/2 align:b flip');
            expect($ele).toHaveAttr('ag', 'split:3/2 align:b flip');
            
            attr('ag', ele).remove('split:3/2');
            expect($ele).toHaveAttr('ag', 'align:b flip');
            
            attr('ag', ele).remove('align:b');
            expect($ele).toHaveAttr('ag', 'flip');
            
            attr('ag', ele).remove('flip');
            expect($ele).toHaveAttr('ag', '');
        });
    });
});
