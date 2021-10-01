// Namespace //
var testNamespace = testNamespace || {};

testNamespace.testClass = function() {
    // Constants
    this.GRID_WIDTH = 70;
    this.SPEAKER = "An Aboleth, probably";
    
    // Variables
    this.target;
    this.reticle;
    this.playerCount;

    // Initialize
    this.onOpen = function() {
        log("Test Script Started!");
        this.playerCount = 0;
    };
    // Parses message for the command being given.
    this.onMsg = function(msg){
        log("Test Script parsing message: " + msg.content)
        // Only search line if it is a macro.
        if (msg.type=="api" && msg.content.indexOf("!") == 0){
            log("Test Script found a macro!")
            // begin parsing.
            if(msg.content.indexOf("!whois") == 0){         // !whois
                if (msg.content.indexOf("!whois target") == 0){
                    this.whoIsTarget(msg);
                } else {
                    this.whoIs(msg);
                }
            } else if(msg.content.indexOf("!step") == 0){  // !step
                //this.step(msg);
                this.stepTarget(msg);
            } else if(msg.content.indexOf("!target") == 0){
                this.targetSelected(msg);
            } else if (msg.content.indexOf("!reticle") == 0){
                this.setReticle(msg);
            } else if (msg.content.indexOf("!moveto") == 0) {
                this.moveTo(msg);
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
    // Function to output the name of the target token.
    this.whoIsTarget = function(msg){
        let selected = this.target;
        if (selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "I have no thrall to command. What a pity.");
        } else {                        // Greets selected token.
            let token = getObj("graphic", selected[0]._id);
            sendChat(this.SPEAKER, "My thrall at the moment is " + token.get("name") + ".")
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
    // Function to step target in a direction.
    this.stepTarget = function(msg){
        let selected = this.target;
        if (selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "Something must exist before it can step.");
        } else {                        // moves target token.
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

    // Move target to the reticle
    this.moveTo = function(msg){
        let selected = this.target;
        let ret = this.reticle;
        if (selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "Something must exist before it can step.");
        } else {                        // moves target token.
            let token = getObj("graphic", selected[0]._id);
            let newToken = getObj("graphic", ret[0]._id);
            token.set('left',newToken.get('left'))
            token.set('top',newToken.get('top'))
            
        }
    }
    
    // Function to target the selected token.
    this.targetSelected = function(msg){
        let oldToken = null;
        
        if (msg.selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "Nothing to target.");
        } else {
            // remove aura from last target if one exists.
            if (this.target !== undefined){
                oldToken = getObj("graphic", this.target[0]._id);
                oldToken.set('aura1_radius', null);
            }
            // Set new target.
            this.target = msg.selected;
            let token = getObj("graphic", this.target[0]._id);
            // Theatrics.
            token.set('aura1_radius', 0);
            token.set('aura1_color', '#980000');
            spawnFx(token.get('left'),token.get('top'),"burst-death",token.get("pageid"));
            if ((oldToken != null) && (oldToken !== token)){
                spawnFxBetweenPoints(
                    {x: oldToken.get('left'), y: oldToken.get('top')},
                    {x: token.get('left'), y: token.get('top')},
                    'beam-blood');
            }
            
            sendChat(this.SPEAKER, "A lovely thrall that " + token.get("name") + " makes.")
        }
    }
    
    // Assign a reticle
    this.setReticle = function(msg){
        if (msg.selected === undefined){    // No token selected.
            sendChat(this.SPEAKER, "Nothing to target.");
        } else {
            // Set new target.
            this.reticle = msg.selected;
            let token = getObj("graphic", this.reticle[0]._id);
            
            sendChat(this.SPEAKER, "Reticle assigned to " + token.get("name"))
        }
    }
    
    // clear target
    this.clearTarget = function(){
        log("clearing target!");
        let token = null;
        
        if (this.target !== undefined){
            token = getObj("graphic", this.target[0]._id);
            token.set('aura1_radius', null);
            this.target = undefined;
        }
    }
    
    // Greeter
    this.greet = function(obj){
        var that = this;
        if(obj.get("_online") == true) {
            setTimeout(function() {
                that.playerCount++;
                sendChat("Narrator", "A hero enters.");
                log("Player Count: " + that.playerCount);
                if (that.playerCount <= 0) {
                    that.clearTarget();
                }
            }, 3000);
        }
        if(obj.get("_online") == false) {
            setTimeout(function() {
                that.playerCount--;
                sendChat("Narrator", "All stories end.");
                log("Player Count: " + that.playerCount);
                if (that.playerCount <= 0) {
                    that.clearTarget();
                }
            }, 500);
        }
    }
};



// Main //

var test;

on("ready", function() {
    test = new testNamespace.testClass();
    test.onOpen();
});

on("chat:message", function(msg) {
    test.onMsg(msg);
});

on('change:player:_online', function(obj){
    test.greet(obj);
});