describe('attr', function () {

    var $ele;
    var ele;

    beforeEach(function () {
        setFixtures('<div id="test"></div>');
        $ele = $('#test');
        ele = $ele[0];
    });

    afterEach(function () {
        $ele = null;
        ele =  null;
    });


    //Core attr object
    
    it('should return an attrList object', function () {
        expect(attr()).toEqual(jasmine.any(Object));
    });
    
    it('should have method set', function () {
        expect(attr().set).toEqual(jasmine.any(Function));
    });
    
    it('should have method get', function () {
        expect(attr().get).toEqual(jasmine.any(Function));
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
    
    describe('attr.set', function () {
        
        it('should set attribute', function () {
            expect($ele).not.toHaveAttr('ag');
            attr('ag', ele).set();
            expect($ele).toHaveAttr('ag');
        });
    
        it('should set attribute value', function () {
            expect($ele).not.toHaveAttr('ag', 'split:1/2');
            attr('ag', ele).set('split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
        });
    
        it('should overwrite attribute value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(ele).toHaveAttr('ag', 'split:1/2 space:5');
            
            attr('ag', ele).set('split:3/2 space:1');
            expect(ele).toHaveAttr('ag', 'split:3/2 space:1');
        });
    
        it('should clear attribute value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(ele).toHaveAttr('ag', 'split:1/2 space:5');
            
            attr('ag', ele).set();
            expect(ele).toHaveAttr('ag', '');
        });
    });
    
    
    //Get method
    
    describe('attr.get', function () {
    
        it('should get attribute value as string', function () {
            expect(attr('ag', ele).get()).toEqual(jasmine.any(String));
        });
        
        it('should return an empty string', function () {
            attr('ag', ele).set();
            expect(attr('ag', ele).get()).toBe('');
        });
        
        it('should return a string value', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(attr('ag', ele).get()).toBe('split:1/2 space:5');
        });
        
        it('should get attribute value as array', function () {
            expect(attr('ag', ele).get(true)).toEqual(jasmine.any(Array));
        });
        
        it('should return an empty array', function () {
            expect(attr('ag', ele).get(true).length).toBe(0);
        });
        
        it('should return an array of values', function () {
            attr('ag', ele).set('split:1/2 space:5');
            expect(attr('ag', ele).get(true).length).toBe(2);
        });
    });
    
    
    //Has method
    
    describe('attr.has', function () {
        
        it('should return true if attribute exists', function () {
            attr('ag', ele).set();
            expect(attr('ag', ele).has()).toBe(true);
            expect(attr('ag', ele).has('')).toBe(true);
            expect(attr('ag', ele).has(' ')).toBe(true);
        });
        
        it('should return true if the attribute values exist', function () {
            attr('ag', ele).set('split:1/2 space:1 align:b flip');
            expect(attr('ag', ele).has('split:1/2')).toBe(true);
            expect(attr('ag', ele).has('flip space:1')).toBe(true);
            expect(attr('ag', ele).has('align:b space:1 split:1/2')).toBe(true);
            expect(attr('ag', ele).has('align:b flip space:1 split:1/2')).toBe(true);
        });
        
        it('should return false if the attribute does not exist', function () {
            expect(attr('ag', ele).has()).toBe(false);
        });
        
        it('should return false if the attribute values do not exist', function () {
            attr('ag', ele).set('split:1/2 align:b');
            expect(attr('ag', ele).has('space:3')).toBe(false);
            expect(attr('ag', ele).has('split:1/2 space:3')).toBe(false);
            expect(attr('ag', ele).has('split:1/2 align:b space:3')).toBe(false);
        });
    });
    
    
    //Add method
    
    describe('attr.add', function () {
    
        it('should add attribute', function () {
            expect($ele).not.toHaveAttr('ag');
            attr('ag', ele).add();
            expect($ele).toHaveAttr('ag');
        });
        
        it('should add a single attribute value', function () {
            attr('ag', ele).add('split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
            
            attr('ag', ele).add('space:1');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1');
            
            attr('ag', ele).add('align:b');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1 align:b');
            
            attr('ag', ele).add('flip');
            expect($ele).toHaveAttr('ag', 'split:1/2 space:1 align:b flip');
        });
        
        it('should add multiple attribute values', function () {
            attr('ag', ele).add('split:3/1 space:2');
            var attrList = attr('ag', ele).get(true);
            expect(attrList).toContain('split:3/1');
            expect(attrList).toContain('space:2');
           
            attr('ag', ele).add('align:t flip');
            var attrList = attr('ag', ele).get(true);
            expect(attrList).toContain('align:t');
            expect(attrList).toContain('flip');
        });
        
        it('should only add an attribute once', function () {
            attr('ag', ele).add('split:1/2');
            attr('ag', ele).add('split:1/2');
            attr('ag', ele).add('split:1/2 split:1/2');
            expect($ele).toHaveAttr('ag', 'split:1/2');
        });
    });
    
    
    //Remove method
    
    describe('attr.remove', function () {
        
        it('should remove attribute', function () {
            attr('ag', ele).set('split:3/2 align:b flip');
            attr('ag', ele).remove();
            expect($ele).not.toHaveAttr('ag');
        });
        
        it('should remove a single attribute value', function () {
            attr('ag', ele).set('split:3/2 align:b flip');
            expect($ele).toHaveAttr('ag', 'split:3/2 align:b flip');
            
            attr('ag', ele).remove('split:3/2');
            expect($ele).toHaveAttr('ag', 'align:b flip');
            
            attr('ag', ele).remove('align:b');
            expect($ele).toHaveAttr('ag', 'flip');
            
            attr('ag', ele).remove('flip');
            expect($ele).toHaveAttr('ag', '');
        });
        
        it('should remove multiple attribute values', function () {
            attr('ag', ele).set('split:3/2 space:5 align:m flip');
            expect($ele).toHaveAttr('ag', 'split:3/2 space:5 align:m flip');
            
            attr('ag', ele).remove('align:m split:3/2 hello world');
            expect($ele).toHaveAttr('ag', 'space:5 flip');
            
            attr('ag', ele).remove('space:5 flip');
            expect($ele).toHaveAttr('ag', '');
        });
    });
});
