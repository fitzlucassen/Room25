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
    this.socket.on('play', function(object) {
        that.view.redirectToGame(object);
    });
};

ClientController.prototype.newUser = function(name) {
    this.socket.emit('readyToPlay', {
        name: name
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