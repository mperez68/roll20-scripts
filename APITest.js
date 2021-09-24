var testNamespace = testNamespace || {};

testNamespace.testClass = function() {
    this.GRID_WIDTH = 70;
    this.SPEAKER = "An Aboleth, Definitely";

    this.onOpen = function() {
        log("Test Script Started!");
    };
    // Parses message for the command being given.
    this.onMsg = function(msg){
        log("Test Script parsing message: " + msg.content)
        // Only search line if it is a macro.
        if (msg.type=="api" && msg.content.indexOf("!") == 0){
            log("Test Script found a macro!")
            // begin parsing.
            if(msg.content.indexOf("!whois") == 0){         // !whois
                this.whoIs(msg);
            } else if(msg.content.indexOf("!step") == 0){  // !step
                this.step(msg);
            } else {
                log("Test Script read something else: " + msg.content)
                sendChat(this.SPEAKER, "You babble so foolishly.")
            }
        }
    };
    // Function to output the name of the selected token.
    this.whoIs = function(msg){
        let selected = msg.selected;
        if (selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "I see nothing.");
        } else {                        // Greets selected token.
            let token = getObj("graphic", selected[0]._id);
            sendChat(this.SPEAKER, "Ah, hello there, " + token.get("name") + ".")
        }
    };
    // Function to step in a direction.
    this.step = function(msg){
        let selected = msg.selected;
        if (selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "Something must exist before it can step.");
        } else {                        // moves selected token.
            let token = getObj("graphic", selected[0]._id);
            // Identify direction, move in corresponding result.
            if(msg.content.indexOf("!step left") == 0) {
                token.set('left',token.get('left') - this.GRID_WIDTH)
            } else if(msg.content.indexOf("!step up") == 0) {
                token.set('top',token.get('top') - this.GRID_WIDTH)
            } else if(msg.content.indexOf("!step right") == 0) {
                token.set('left',token.get('left') + this.GRID_WIDTH)
            } else if(msg.content.indexOf("!step down") == 0) {
                token.set('top',token.get('top') + this.GRID_WIDTH)
            } else {
                sendChat(this.SPEAKER, "One needs to know where it is going for it to go there.")
            }
            
        }
    };
};

on("ready", function() {
    let test = new testNamespace.testClass();
    test.onOpen();
});

on("chat:message", function(msg) {
    let test = new testNamespace.testClass();
    test.onMsg(msg);
});