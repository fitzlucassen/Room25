var debugManager = function(){
    this.debugArray = function(array) {
        for (var a in array) {
            console.log(a + ' -> ' + array[a]);
        }
    };

    this.debugObject = function(object){
        var props = '';

        for (var prop in object){ 
            props += prop +  " => " + object[prop] + "\n"; 
        }
        console.log(props);
    };

    this.debugArrayOfObject = function(array){
        var that = this;
        for (var a in array) {
            that.debugObject(array[a]);
        }
    };

    this.messageForUser = function(user, message){
        console.log('L\'utilisateur ' + user.id + ' : ' + user.name + ' ' + message);
    };
};

exports.debugManager = debugManager;
