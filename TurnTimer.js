var myNamespace = myNamespace || {};

myNamespace.myclass = function() {
    this.onOpen = function() {
        log("Test Script Started!");
    };
    
    this.onMsg = function() {
        log("Test Script Read Message!");
    };
};

on("ready", function() {
    let test = new myNamespace.myclass();
    test.onOpen();
});

on("chat:message", function(msg) {
    let test = new myNamespace.myclass();
    test.onMsg();
});