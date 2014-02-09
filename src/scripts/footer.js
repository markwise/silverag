    domReady(function () {
        body = doc.body;
        layouts.initialize();
        domReady = null;
    });
    
    
    return {
        version: version
    };
}());
