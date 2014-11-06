/* global generateAgId */

describe('generateAgId', function () {

    it('should generate a UUID for a layout', function () {
        setFixtures('<div ag></div>');
        
        var $ele = $('[ag]'),
            ele = $ele[0],
            agid;
        
        expect($ele).not.toHaveProp('agid');
        agid = generateAgId(ele);
        expect($ele).toHaveProp('agid', agid);
    });
});