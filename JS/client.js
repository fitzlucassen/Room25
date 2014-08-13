function ClientController(view) {
    this.socket = {};
    this.view = view;
}

ClientController.prototype.initialize = function() {
    this.socket = io.connect('http://localhost:1337');

    that = this;
    this.socket.on('connectedUser', function(object) {
        that.view.appendUserID(object.me);
        that.view.refreshUsers(object.users);
    });
    this.socket.on('disconnectedUser', function(user) {
        that.view.deleteUser(user);
    });
    this.socket.on('newCharacter', function(object) {
        that.view.deleteCharacter(object.id, object.name, object.pseudo);
    });
    this.socket.on('cantPlay', function() {
        that.view.deleteButton();
    });
    this.socket.on('letsPlay', function() {
        that.view.showButton();
    });
    this.socket.on('everyoneIsOk', function(users) {
        that.view.hideActions();
        var u = {};

        for (var a in users) {
            if (users.hasOwnProperty(a)) {
                if (users[a].order == 1){
                    u = users[a];
                    break;
                }
            }
        }
        that.view.appendTurnOf(u);
    });
    this.socket.on('play', function(object) {
        LastCoords = object.lastCardsCoords;
        OtherCoords = object.otherCoords;

        that.view.redirectToGame(object);
    });
};

ClientController.prototype.newUser = function(name) {
    this.socket.emit('readyToPlay', {
        name: name
    });
};

ClientController.prototype.validateAction = function(id, action1, action2) {
    this.socket.emit('playerReady', {
        id: id,
        action1: action1,
        action2: action2
    });
};

ClientController.prototype.characterChoosen = function(name, id) {
    this.socket.emit('characterChoosen', {
        name: name,
        id: id
    });
};

ClientController.prototype.play = function() {
    this.socket.emit('emitPlay');
};